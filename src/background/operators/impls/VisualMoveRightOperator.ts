import { inject, injectable } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";
import { VisualClient } from "../../clients/VisualClient";

@injectable()
export class VisualMoveRightOperator implements Operator {
  constructor(
    @inject(VisualClient)
    private readonly visualClient: VisualClient,
  ) {}

  name() {
    return "visual.right";
  }

  schema() {
    return z.object({
      count: z.number().default(1),
    });
  }

  async run(
    { sender }: OperatorContext,
    { count }: z.infer<ReturnType<VisualMoveRightOperator["schema"]>>,
  ): Promise<void> {
    await this.visualClient.moveRight(sender.tabId, sender.frameId, count);
  }
}
