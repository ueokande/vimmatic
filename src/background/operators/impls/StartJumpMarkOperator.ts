import { injectable, inject } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
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

  run({ sender }: OperatorContext): Promise<void> {
    return this.markModeUseCase.enableMarkJumpMode(sender.tabId);
  }
}
