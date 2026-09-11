import { inject, injectable } from "inversify";
import { Mode } from "../../../shared/mode";
import { ModeUseCase } from "../../usecases/ModeUseCase";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class StartSetMarkOperator implements Operator {
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
