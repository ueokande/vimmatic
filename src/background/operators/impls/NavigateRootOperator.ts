import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class NavigateRootOperator implements Operator {
  name() {
    return "navigate.root";
  }

  schema() {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id || !tab.url) {
      return;
    }
    const url = new URL(tab.url);
    await browser.tabs.update(tab.id, { url: url.origin });
  }
}
