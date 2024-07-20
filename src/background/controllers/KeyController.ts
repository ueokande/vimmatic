import { injectable, inject } from "inversify";
import type { RequestContext } from "../messaging/types";
import { MarkJumpUseCase } from "../usecases/MarkJumpUseCase";
import { MarkSetUseCase } from "../usecases/MarkSetUseCase";
import { HintModeUseCase } from "../usecases/HintModeUseCase";
import { HintKeyUseCase } from "../usecases/HintKeyUseCase";
import { ModeUseCase } from "../usecases/ModeUseCase";

@injectable()
export class KeyController {
  constructor(
    @inject(MarkSetUseCase)
    private readonly markSetUseCase: MarkSetUseCase,
    @inject(MarkJumpUseCase)
    private readonly markJumpUseCase: MarkJumpUseCase,
    @inject(HintModeUseCase)
    private readonly hintModeUseCase: HintModeUseCase,
    @inject(HintKeyUseCase)
    private readonly hintKeyUseCase: HintKeyUseCase,
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
  ) {}

  async pressKey({ sender }: RequestContext, { key }: { key: string }) {
    if (typeof sender.tab?.id === "undefined") {
      return;
    }

    const mode = await this.modeUseCase.getMode();
    if (mode === "follow") {
      const continued = await this.hintKeyUseCase.pressKey(sender.tab.id, key);
      if (!continued) {
        await this.hintModeUseCase.stop(sender.tab.id);
        await this.modeUseCase.resetMode(sender.tab.id);
      }
    } else if (mode === "mark-set") {
      await this.markSetUseCase.setMark(sender.tab, key);
      await this.modeUseCase.resetMode(sender.tab.id);
    } else if (mode === "mark-jump") {
      await this.markJumpUseCase.jumpToMark(key);
      await this.modeUseCase.resetMode(sender.tab.id);
    }
  }
}
