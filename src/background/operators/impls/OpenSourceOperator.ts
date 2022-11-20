import Operator from "../Operator";

export default class OpenSourceOperator implements Operator {
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
