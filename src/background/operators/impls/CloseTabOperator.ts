import { injectable } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class CloseTabOperator implements Operator {
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
    { force, select }: z.infer<ReturnType<CloseTabOperator["schema"]>>,
  ): Promise<void> {
    if (!force && sender.tab.pinned) {
      return;
    }
    if (select === "left" && sender.tab.index > 0) {
      const tabs = await chrome.tabs.query({
        windowId: sender.tab.windowId,
      });
      const tabId = tabs[sender.tab.index - 1].id;
      if (typeof tabId === "undefined") {
        throw new Error(`tab ${tabs[sender.tab.index - 1].index} has not id`);
      }
      await chrome.tabs.update(tabId, { active: true });
    }
    return chrome.tabs.remove(sender.tabId);
  }
}
