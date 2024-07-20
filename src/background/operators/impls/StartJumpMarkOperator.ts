import { injectable, inject } from "inversify";
import type { Operator, OperatorContext } from "../types";
import { ModeUseCase } from "../../usecases/ModeUseCase";
import { Mode } from "../../../shared/mode";

@injectable()
export class StartJumpMarkOperator implements Operator {
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
