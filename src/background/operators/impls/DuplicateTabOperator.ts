import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class DuplicateTabOperator implements Operator {
  name(): string {
    return "tabs.duplicate";
  }

  schema() {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    await browser.tabs.duplicate(tab.id);
  }
}
