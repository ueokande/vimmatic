import Operator from "../Operator";

export default class SelectFirstTabOperator implements Operator {
  async run(): Promise<void> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    await browser.tabs.update(tabs[0].id, { active: true });
  }
}
