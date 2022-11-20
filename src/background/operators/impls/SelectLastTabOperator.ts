import Operator from "../Operator";

export default class SelectLastTabOperator implements Operator {
  async run(): Promise<void> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    await browser.tabs.update(tabs[tabs.length - 1].id, { active: true });
  }
}
