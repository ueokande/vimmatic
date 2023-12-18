import { injectable, inject } from "inversify";
import RequestContext from "../messaging/RequestContext";
import MarkJumpUseCase from "../usecases/MarkJumpUseCase";
import MarkSetUseCase from "../usecases/MarkSetUseCase";
import MarkModeUseCase from "../usecases/MarkModeUseCase";
import HintModeUseCaes from "../usecases/HintModeUseCase";
import HintKeyUseCase from "../usecases/HintKeyUseCase";

@injectable()
export default class KeyController {
  constructor(
    @inject(MarkSetUseCase)
    private readonly markSetUseCase: MarkSetUseCase,
    @inject(MarkJumpUseCase)
    private readonly markJumpUseCase: MarkJumpUseCase,
    @inject(MarkModeUseCase)
    private readonly markModeUseCase: MarkModeUseCase,
    @inject(HintModeUseCaes)
    private readonly hintModeUseCaes: HintModeUseCaes,
    @inject(HintKeyUseCase)
    private readonly hintKeyUseCase: HintKeyUseCase,
  ) {}

  async pressKey({ sender }: RequestContext, { key }: { key: string }) {
    if (typeof sender.tab?.id === "undefined") {
      return;
    }
    if (await this.markModeUseCase.isSetMode()) {
      await this.markSetUseCase.setMark(sender.tab, key);
      await this.markModeUseCase.clearMarkMode(sender.tab.id);
    } else if (await this.markModeUseCase.isJumpMode()) {
      await this.markJumpUseCase.jumpToMark(key);
      await this.markModeUseCase.clearMarkMode(sender.tab.id);
    }

    if (await this.hintModeUseCaes.isHintMode()) {
      const cont = await this.hintKeyUseCase.pressKey(sender.tab.id, key);
      if (!cont) {
        await this.hintModeUseCaes.stop(sender.tab.id);
      }
    }
  }
}
