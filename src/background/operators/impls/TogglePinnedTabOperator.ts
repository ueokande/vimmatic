import { injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";

@injectable()
export default class TogglePinnedTabOperator implements Operator {
  name(): string {
    return "tabs.pin.toggle";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await chrome.tabs.update({ pinned: !sender.tab.pinned });
  }
}
