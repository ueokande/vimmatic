import { inject, injectable } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";
import { VisualClient } from "../../clients/VisualClient";

@injectable()
export class VisualMoveEndWordOperator implements Operator {
  constructor(
    @inject(VisualClient)
    private readonly visualClient: VisualClient,
  ) {}

  name() {
    return "visual.word.end";
  }

  schema() {
    return z.object({
      count: z.number().default(1),
    });
  }

  async run(
    { sender }: OperatorContext,
    { count }: z.infer<ReturnType<VisualMoveEndWordOperator["schema"]>>,
  ): Promise<void> {
    await this.visualClient.moveEndWord(sender.tabId, sender.frameId, count);
  }
}
