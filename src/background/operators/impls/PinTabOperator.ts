import Operator from "../Operator";

export default class PinTabOperator implements Operator {
  async run(): Promise<void> {
    await browser.tabs.update({ pinned: true });
  }
}
