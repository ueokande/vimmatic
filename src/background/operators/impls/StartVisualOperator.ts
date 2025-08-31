import { injectable, inject } from "inversify";
import type { Operator, OperatorContext } from "../types";
import { ModeUseCase } from "../../usecases/ModeUseCase";
import { VisualModeUseCase } from "../../usecases/VisualModeUseCase";
import { Mode } from "../../../shared/mode";

@injectable()
export class StartVisualOperator implements Operator {
  constructor(
    @inject(VisualModeUseCase)
    private readonly visualModeUseCase: VisualModeUseCase,
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
  ) {}

  name(): string {
    return "find.visual.start";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    await this.visualModeUseCase.start(ctx.sender.tabId, "find.visual.start");
    await this.modeUseCase.setMode(ctx.sender.tabId, Mode.Visual);
  }
}
