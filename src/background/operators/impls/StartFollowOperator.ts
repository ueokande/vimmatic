import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import FollowModeUseCase from "../../usecases/FollowModeUseCase";

@injectable()
export default class StartFollowOperator implements Operator {
  constructor(
    @inject(FollowModeUseCase)
    private readonly followModeUseCase: FollowModeUseCase
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
    { newTab, background }: z.infer<ReturnType<StartFollowOperator["schema"]>>
  ): Promise<void> {
    this.followModeUseCase.start(ctx.sender.tabId, newTab, background);
  }
}
