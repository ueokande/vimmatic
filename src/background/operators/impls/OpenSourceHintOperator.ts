import { inject, injectable } from "inversify";
import { z } from "zod";
import { Mode } from "../../../shared/mode";
import { HintModeUseCase } from "../../usecases/HintModeUseCase";
import { ModeUseCase } from "../../usecases/ModeUseCase";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class OpenSourceHintOperator implements Operator {
  constructor(
    @inject(HintModeUseCase)
    private readonly hintModeUseCase: HintModeUseCase,
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
  ) {}

  name(): string {
    return "hint.source";
  }

  schema() {
    return z.object({
      newTab: z.boolean().default(false),
      background: z.boolean().default(false),
    });
  }

  async run(
    ctx: OperatorContext,
    {
      newTab,
      background,
    }: z.infer<ReturnType<OpenSourceHintOperator["schema"]>>,
  ): Promise<void> {
    await this.hintModeUseCase.start(
      ctx.sender.tabId,
      "hint.source",
      newTab,
      background,
    );
    await this.modeUseCase.setMode(ctx.sender.tabId, Mode.Follow);
  }
}
