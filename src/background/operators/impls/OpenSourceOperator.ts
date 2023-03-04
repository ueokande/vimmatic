import { injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";

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
    await browser.tabs.create({ url });
  }
}
