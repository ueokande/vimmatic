import { injectable } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class OpenSourceOperator implements Operator {
  name() {
    return "navigate.source";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    if (typeof sender.tab.url === "undefined") {
      return;
    }
    const url = "view-source:" + sender.tab.url;
    await browser.tabs.create({ url });
  }
}
