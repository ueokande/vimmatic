import { injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class TogglePinnedTabOperator implements Operator {
  name(): string {
    return "tabs.pin.toggle";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await chrome.tabs.update({ pinned: !sender.tab.pinned });
  }
}
