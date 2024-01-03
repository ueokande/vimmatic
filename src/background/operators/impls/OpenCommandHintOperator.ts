import { inject, injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import HintModeUseCase from "../../usecases/HintModeUseCase";
import ModeUseCase from "../../usecases/ModeUseCase";
import Mode from "../../../shared/Mode";

@injectable()
export default class OpenCommandHintOperator implements Operator {
  constructor(
    @inject(HintModeUseCase)
    private readonly hintModeUseCase: HintModeUseCase,
    @inject(ModeUseCase)
    private modeUseCase: ModeUseCase,
  ) {}

  name(): string {
    return "hint.command.open";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    await this.hintModeUseCase.start(
      ctx.sender.tabId,
      "hint.command.open",
      false,
      false,
    );
    await this.modeUseCase.setMode(ctx.sender.tabId, Mode.Follow);
  }
}