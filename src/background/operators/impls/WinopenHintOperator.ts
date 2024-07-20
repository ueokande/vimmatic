import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import { HintModeUseCase } from "../../usecases/HintModeUseCase";
import { ModeUseCase } from "../../usecases/ModeUseCase";
import { Mode } from "../../../shared/mode";

@injectable()
export class WinopenHintOperator implements Operator {
  constructor(
    @inject(HintModeUseCase)
    private readonly hintModeUseCase: HintModeUseCase,
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
  ) {}

  name(): string {
    return "hint.winopen";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    await this.hintModeUseCase.start(
      ctx.sender.tabId,
      "hint.winopen",
      false,
      false,
    );
    await this.modeUseCase.setMode(ctx.sender.tabId, Mode.Follow);
  }
}
