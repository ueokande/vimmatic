import { injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";

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

  async run({
    force,
    select,
  }: z.infer<ReturnType<CloseTabOperator["schema"]>>): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    if (!force && tab.pinned) {
      return;
    }
    if (select === "left" && tab.index > 0) {
      const tabs = await browser.tabs.query({ windowId: tab.windowId });
      await browser.tabs.update(tabs[tab.index - 1].id, { active: true });
    }
    return browser.tabs.remove(tab.id);
  }
}
