import { injectable, inject } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import MarkModeUseCase from "../../usecases/MarkModeUseCase";

@injectable()
export default class StartSetMarkOperator implements Operator {
  constructor(
    @inject(MarkModeUseCase)
    private markModeUseCase: MarkModeUseCase
  ) {}

  name() {
    return "mark.set.prefix";
  }

  schema() {}

  run(ctx: OperatorContext): Promise<void> {
    return this.markModeUseCase.enableMarkSetMode(ctx.sender.tabId);
  }
}
