import { injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class NavigateRootOperator implements Operator {
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
