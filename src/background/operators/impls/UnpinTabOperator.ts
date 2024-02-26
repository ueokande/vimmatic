import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export default class UnpinTabOperator implements Operator {
  name(): string {
    return "tabs.unpin";
  }

  schema() {}

  async run(): Promise<void> {
    await chrome.tabs.update({ pinned: false });
  }
}
