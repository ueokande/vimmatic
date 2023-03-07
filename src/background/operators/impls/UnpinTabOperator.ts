import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class UnpinTabOperator implements Operator {
  name(): string {
    return "tabs.unpin";
  }

  schema() {}

  async run(): Promise<void> {
    await chrome.tabs.update({ pinned: false });
  }
}
