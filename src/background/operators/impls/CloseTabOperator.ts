import { injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";

@injectable()
export default class CloseTabOperator implements Operator {
  name() {
    return "tabs.close";
  }

  schema() {
    return z.object({
      select: z.union([z.literal("left"), z.literal("right")]).default("right"),
      force: z.boolean().default(false),
    });
  }

  async run(
    { sender }: OperatorContext,
    { force, select }: z.infer<ReturnType<CloseTabOperator["schema"]>>
  ): Promise<void> {
    if (!force && sender.tab.pinned) {
      return;
    }
    if (select === "left" && sender.tab.index > 0) {
      const tabs = await browser.tabs.query({
        windowId: sender.tab.windowId,
      });
      await browser.tabs.update(tabs[sender.tab.index - 1].id, {
        active: true,
      });
    }
    return browser.tabs.remove(sender.tabId);
  }
}
