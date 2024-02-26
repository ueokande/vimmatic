import { injectable, inject } from "inversify";
import type { Operator, OperatorContext } from "../types";
import ModeUseCase from "../../usecases/ModeUseCase";
import { Mode } from "../../../shared/mode";

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
