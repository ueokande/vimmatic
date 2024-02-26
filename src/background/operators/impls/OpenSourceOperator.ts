import { injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";

@injectable()
export default class OpenSourceOperator implements Operator {
  name() {
    return "navigate.source";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    if (typeof sender.tab.url === "undefined") {
      return;
    }
    const url = "view-source:" + sender.tab.url;
    await chrome.tabs.create({ url });
  }
}
