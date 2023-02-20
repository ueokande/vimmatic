import { injectable, inject } from "inversify";
import RequestContext from "../infrastructures/RequestContext";
import MarkJumpUseCase from "../usecases/MarkJumpUseCase";
import MarkSetUseCase from "../usecases/MarkSetUseCase";
import MarkModeUseCase from "../usecases/MarkModeUseCase";

@injectable()
export default class MarkController {
  constructor(
    @inject(MarkSetUseCase)
    private readonly markSetUseCase: MarkSetUseCase,
    @inject(MarkJumpUseCase)
    private readonly markJumpUseCase: MarkJumpUseCase,
    @inject(MarkModeUseCase)
    private readonly markModeUseCase: MarkModeUseCase
  ) {}

  async pressKey(ctx: RequestContext, { key }: { key: string }) {
    if (await this.markModeUseCase.isSetMode()) {
      await this.markSetUseCase.setMark(key);
    } else if (await this.markModeUseCase.isJumpMode()) {
      await this.markJumpUseCase.jumpToMark(key);
    }
    await this.markModeUseCase.clearMarkMode(ctx);
  }
}
