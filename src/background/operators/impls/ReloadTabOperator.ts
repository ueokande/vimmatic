import { injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";

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
