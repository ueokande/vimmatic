import { injectable } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class NavigateParentOperator implements Operator {
  name() {
    return "navigate.parent";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    if (!sender?.tab?.url) {
      return;
    }
    const url = new URL(sender.tab.url);
    if (url.hash.length > 0) {
      url.hash = "";
    } else if (url.search.length > 0) {
      url.search = "";
    } else {
      const basenamePattern = /\/[^/]+$/;
      const lastDirPattern = /\/[^/]+\/$/;
      if (basenamePattern.test(url.pathname)) {
        url.pathname = url.pathname.replace(basenamePattern, "/");
      } else if (lastDirPattern.test(url.pathname)) {
        url.pathname = url.pathname.replace(lastDirPattern, "/");
      }
    }
    await browser.tabs.update({ url: url.href });
  }
}
