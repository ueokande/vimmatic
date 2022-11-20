import Operator from "../Operator";

export default class DuplicateTabOperator implements Operator {
  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    await browser.tabs.duplicate(tab.id);
  }
}
