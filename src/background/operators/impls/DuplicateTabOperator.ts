import { injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class DuplicateTabOperator implements Operator {
  name(): string {
    return "tabs.duplicate";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await chrome.tabs.duplicate(sender.tabId);
  }
}
