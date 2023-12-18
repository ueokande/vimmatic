import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import HintModeUseCase from "../../usecases/HintModeUseCase";

@injectable()
export default class StartFollowOperator implements Operator {
  constructor(
    @inject(HintModeUseCase)
    private readonly hintModeUseCase: HintModeUseCase,
  ) {}

  name(): string {
    return "follow.start";
  }

  schema() {
    return z.object({
      newTab: z.boolean().default(false),
      background: z.boolean().default(false),
    });
  }

  async run(
    ctx: OperatorContext,
    { newTab, background }: z.infer<ReturnType<StartFollowOperator["schema"]>>,
  ): Promise<void> {
    this.hintModeUseCase.start(ctx.sender.tabId, newTab, background);
  }
}
