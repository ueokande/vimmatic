import Operator from "../Operator";

export default class UnpinTabOperator implements Operator {
  async run(): Promise<void> {
    await browser.tabs.update({ pinned: false });
  }
}
