import { injectable } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class NavigateRootOperator implements Operator {
  name() {
    return "navigate.root";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    if (!sender?.tab?.id || !sender?.tab?.url) {
      return;
    }
    const url = new URL(sender.tab.url);
    await browser.tabs.update({ url: url.origin });
  }
}
