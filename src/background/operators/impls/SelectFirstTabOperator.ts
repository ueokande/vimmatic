import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class SelectFirstTabOperator implements Operator {
  name() {
    return "tabs.first";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    await browser.tabs.update(tabs[0].id, { active: true });
  }
}
