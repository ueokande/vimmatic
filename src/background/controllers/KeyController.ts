import { injectable, inject } from "inversify";
import RequestContext from "../infrastructures/RequestContext";
import MarkJumpUseCase from "../usecases/MarkJumpUseCase";
import MarkSetUseCase from "../usecases/MarkSetUseCase";
import MarkModeUseCase from "../usecases/MarkModeUseCase";
import FollowModeUseCaes from "../usecases/FollowModeUseCase";
import FollowKeyUseCase from "../usecases/FollowKeyUseCase";

@injectable()
export default class KeyController {
  constructor(
    @inject(MarkSetUseCase)
    private readonly markSetUseCase: MarkSetUseCase,
    @inject(MarkJumpUseCase)
    private readonly markJumpUseCase: MarkJumpUseCase,
    @inject(MarkModeUseCase)
    private readonly markModeUseCase: MarkModeUseCase,
    @inject(FollowModeUseCaes)
    private readonly followModeUseCaes: FollowModeUseCaes,
    @inject(FollowKeyUseCase)
    private readonly followKeyUseCase: FollowKeyUseCase
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

    if (await this.followModeUseCaes.isFollowMode()) {
      const cont = await this.followKeyUseCase.pressKey(sender.tab.id, key);
      if (!cont) {
        await this.followModeUseCaes.stop(sender.tab.id);
      }
    }
  }
}
