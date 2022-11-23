import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class OpenSourceOperator implements Operator {
  name() {
    return "navigate.source";
  }

  schema() {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.url) {
      return;
    }
    const url = "view-source:" + tab.url;
    await browser.tabs.create({ url });
  }
}
