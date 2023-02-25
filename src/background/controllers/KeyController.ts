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

  async pressKey(ctx: RequestContext, { key }: { key: string }) {
    if (await this.markModeUseCase.isSetMode()) {
      await this.markSetUseCase.setMark(key);
      await this.markModeUseCase.clearMarkMode(ctx);
    } else if (await this.markModeUseCase.isJumpMode()) {
      await this.markJumpUseCase.jumpToMark(key);
      await this.markModeUseCase.clearMarkMode(ctx);
    }

    if (await this.followModeUseCaes.isFollowMode()) {
      const cont = await this.followKeyUseCase.pressKey(ctx, key);
      if (!cont) {
        await this.followModeUseCaes.stop(ctx);
      }
    }
  }
}
