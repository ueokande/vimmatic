import Operator from "../Operator";

export default class CloseTabOperator implements Operator {
  constructor(
    private readonly force: boolean = false,
    private readonly selectLeft: boolean = false
  ) {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    if (!this.force && tab.pinned) {
      return;
    }
    if (this.selectLeft && tab.index > 0) {
      const tabs = await browser.tabs.query({ windowId: tab.windowId });
      await browser.tabs.update(tabs[tab.index - 1].id, { active: true });
    }
    return browser.tabs.remove(tab.id);
  }
}
