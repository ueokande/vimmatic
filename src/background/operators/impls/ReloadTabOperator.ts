import { injectable } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";

@injectable()
export default class ReloadTabOperator implements Operator {
  name() {
    return "tabs.reload";
  }

  schema() {
    return z.object({
      cache: z.boolean().default(false),
    });
  }

  async run(
    _ctx: OperatorContext,
    { cache }: z.infer<ReturnType<ReloadTabOperator["schema"]>>,
  ): Promise<void> {
    await chrome.tabs.reload({ bypassCache: cache });
  }
}
