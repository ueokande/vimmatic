import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export class SelectTabPrevOperator implements Operator {
  name() {
    return "tabs.prev";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    if (tabs.length < 2) {
      return;
    }
    const currentTab = tabs.find((t) => t.active);
    if (!currentTab) {
      return;
    }
    const select = (currentTab.index - 1 + tabs.length) % tabs.length;
    const tab = tabs[select];
    if (typeof tab.id === "undefined") {
      throw new Error(`tab ${tab.index} has not id`);
    }
    await chrome.tabs.update(tab.id, { active: true });
  }
}
