import Operator from "../Operator";

export default class TogglePinnedTabOperator implements Operator {
  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    await browser.tabs.update(tab.id, { pinned: !tab.pinned });
  }
}
