import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import HintModeUseCase from "../../usecases/HintModeUseCase";
import ModeUseCase from "../../usecases/ModeUseCase";
import Mode from "../../../shared/Mode";

@injectable()
export default class QuickHintOperator implements Operator {
  constructor(
    @inject(HintModeUseCase)
    private readonly hintModeUseCase: HintModeUseCase,
    @inject(ModeUseCase)
    private modeUseCase: ModeUseCase,
  ) {}

  name(): string {
    return "hint.quick";
  }

  schema() {
    return z.object({
      newTab: z.boolean().default(false),
      background: z.boolean().default(false),
    });
  }

  async run(
    ctx: OperatorContext,
    { newTab, background }: z.infer<ReturnType<QuickHintOperator["schema"]>>,
  ): Promise<void> {
    await this.hintModeUseCase.start(
      ctx.sender.tabId,
      "hint.quick",
      newTab,
      background,
    );
    await this.modeUseCase.setMode(ctx.sender.tabId, Mode.Follow);
  }
}
