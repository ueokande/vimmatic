import { inject, injectable } from "inversify";
import { Mode } from "../../../shared/mode";
import { ModeUseCase } from "../../usecases/ModeUseCase";
import type { Operator, OperatorContext } from "../types";

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
