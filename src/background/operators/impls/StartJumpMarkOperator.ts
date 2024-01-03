import { injectable, inject } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ModeUseCase from "../../usecases/ModeUseCase";
import Mode from "../../../shared/Mode";

@injectable()
export default class StartJumpMarkOperator implements Operator {
  constructor(
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
  ) {}

  name() {
    return "mark.jump.prefix";
  }

  schema() {}

  run({ sender }: OperatorContext): Promise<void> {
    return this.modeUseCase.setMode(sender.tabId, Mode.MarkJump);
  }
}
