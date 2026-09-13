import { inject, injectable } from "inversify";
import type { Key } from "../../shared/key";
import { Mode } from "../../shared/mode";
import { BackgroundKeyClient } from "../client/BackgroundKeyClient";
import { ModeRepository } from "../repositories/ModeRepository";
import { KeymapUseCase } from "../usecases/KeymapUseCase";
import { OperationUseCase } from "../usecases/OperationUseCase";

@injectable()
export class KeyController {
  constructor(
    @inject(ModeRepository)
    private readonly modeRepository: ModeRepository,
    @inject(BackgroundKeyClient)
    private readonly backgroundKeyClient: BackgroundKeyClient,
    @inject(KeymapUseCase)
    private readonly keymapUseCase: KeymapUseCase,
    @inject(OperationUseCase)
    private readonly operationUseCase: OperationUseCase,
  ) {}

  press(key: Key): boolean {
    const mode = this.modeRepository.getMode();
    if (mode === Mode.Normal) {
      return this.handleKeymaps(key);
    } else {
      this.sendKey(key);
      return true;
    }
  }

  cancel() {
    this.keymapUseCase.cancel();
  }

  private handleKeymaps(key: Key): boolean {
    const op = this.keymapUseCase.nextOps(key);
    if (op === null) {
      return false;
    }

    // Do not await an asynchronous methods to return a boolean immidiately.
    // The caller requires the synchronous response from the callback to
    // identify to continue of abandon the event propagation.
    this.operationUseCase
      .exec(op.op, op.repeat)
      // biome-ignore lint/suspicious/noConsole: intentional debug logging
      .catch(console.error);
    return true;
  }

  private sendKey(key: Key): void {
    this.backgroundKeyClient.sendKey(key);
  }
}
