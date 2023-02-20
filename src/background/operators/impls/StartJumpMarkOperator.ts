import { injectable, inject } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";
import MarkModeUseCase from "../../usecases/MarkModeUseCase";

@injectable()
export default class StartJumpMarkOperator implements Operator {
  constructor(
    @inject(MarkModeUseCase)
    private markModeUseCase: MarkModeUseCase
  ) {}

  name() {
    return "mark.jump.prefix";
  }

  schema() {}

  run(ctx: RequestContext): Promise<void> {
    return this.markModeUseCase.enableMarkJumpMode(ctx);
  }
}
