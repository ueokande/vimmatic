import Operator from "../Operator";

export default class SelectTabPrevOperator implements Operator {
  async run(): Promise<void> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    if (tabs.length < 2) {
      return;
    }
    const tab = tabs.find((t) => t.active);
    if (!tab) {
      return;
    }
    const select = (tab.index - 1 + tabs.length) % tabs.length;
    await browser.tabs.update(tabs[select].id, { active: true });
  }
}
