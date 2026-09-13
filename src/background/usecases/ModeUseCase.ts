import { inject, injectable } from "inversify";
import { Mode } from "../../shared/mode";
import { ModeClient } from "../clients/ModeClient";
import { ModeRepository } from "../repositories/ModeRepository";

@injectable()
export class ModeUseCase {
  constructor(
    @inject(ModeRepository)
    private readonly modeRepository: ModeRepository,
    @inject(ModeClient)
    private readonly modeClient: ModeClient,
  ) {}

  getMode(tabId: number): Promise<Mode> {
    return this.modeRepository.getMode(tabId);
  }

  async setMode(tabId: number, mode: Mode): Promise<void> {
    await this.modeRepository.setMode(tabId, mode);
    // Broadcast to every frame in the tab so that all frames (and the
    // indicator) share a single, consistent mode.  `newSender(tabId)` with no
    // frame id fans the message out to all frames.
    await this.modeClient.setMode(tabId, mode);
  }

  async resetMode(tabId: number): Promise<void> {
    return this.setMode(tabId, Mode.Normal);
  }
}
