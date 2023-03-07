import { injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";

@injectable()
export default class NavigateRootOperator implements Operator {
  name() {
    return "navigate.root";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    if (typeof sender.tab.url === "undefined") {
      return;
    }
    const url = new URL(sender.tab.url);
    await chrome.tabs.update({ url: url.origin });
  }
}
