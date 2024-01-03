import { injectable, inject } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ModeUseCase from "../../usecases/ModeUseCase";
import Mode from "../../../shared/Mode";

@injectable()
export default class StartSetMarkOperator implements Operator {
  constructor(
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
  ) {}

  name() {
    return "mark.set.prefix";
  }

  schema() {}

  run(ctx: OperatorContext): Promise<void> {
    return this.modeUseCase.setMode(ctx.sender.tabId, Mode.MarkSet);
  }
}
