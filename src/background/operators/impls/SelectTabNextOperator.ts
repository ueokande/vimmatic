import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class SelectTabNextOperator implements Operator {
  name() {
    return "tabs.next";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    if (tabs.length < 2) {
      return;
    }
    const tab = tabs.find((t) => t.active);
    if (!tab) {
      return;
    }
    const select = (tab.index + 1) % tabs.length;
    await browser.tabs.update(tabs[select].id, { active: true });
  }
}
