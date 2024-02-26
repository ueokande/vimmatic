import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export default class SelectFirstTabOperator implements Operator {
  name() {
    return "tabs.first";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const tab = tabs[0];
    if (typeof tab.id === "undefined") {
      throw new Error(`tab ${tab.index} has not id`);
    }
    await chrome.tabs.update(tab.id, { active: true });
  }
}
