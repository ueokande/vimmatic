import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export default class SelectTabNextOperator implements Operator {
  name() {
    return "tabs.next";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    if (tabs.length < 2) {
      return;
    }
    const tab = tabs.find((t) => t.active);
    if (!tab) {
      return;
    }
    const select = (tab.index + 1) % tabs.length;
    const tabId = tabs[select].id;
    if (typeof tabId === "undefined") {
      throw new Error(`tab ${tabs[select].index} has not id`);
    }
    await chrome.tabs.update(tabId, { active: true });
  }
}
