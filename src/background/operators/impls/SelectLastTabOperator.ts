import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class SelectLastTabOperator implements Operator {
  name() {
    return "tabs.last";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    await browser.tabs.update(tabs[tabs.length - 1].id, { active: true });
  }
}
