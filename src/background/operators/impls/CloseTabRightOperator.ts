import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export class CloseTabRightOperator implements Operator {
  name(): string {
    return "tabs.close.right";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    tabs.sort((t1, t2) => t1.index - t2.index);
    const index = tabs.findIndex((t) => t.active);
    if (index < 0) {
      return;
    }
    const tabIds = tabs
      .filter((t) => t.index > index && t.id)
      .map((t) => t.id!);
    await chrome.tabs.remove(tabIds);
  }
}
