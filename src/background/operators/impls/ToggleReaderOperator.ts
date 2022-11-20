import Operator from "../Operator";

export default class ToggleReaderOperator implements Operator {
  async run(): Promise<void> {
    await browser.tabs.toggleReaderMode();
  }
}
