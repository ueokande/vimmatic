import Operator from "../Operator";

export default class CloseTabRightOperator implements Operator {
  async run(): Promise<void> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    tabs.sort((t1, t2) => t1.index - t2.index);
    const index = tabs.findIndex((t) => t.active);
    if (index < 0) {
      return;
    }
    const tabIds = tabs
      .filter((t) => t.index > index && t.id)
      .map((t) => t.id!);
    await browser.tabs.remove(tabIds);
  }
}
