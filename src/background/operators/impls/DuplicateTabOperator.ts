import { injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";

@injectable()
export default class DuplicateTabOperator implements Operator {
  name(): string {
    return "tabs.duplicate";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await browser.tabs.duplicate(sender.tabId);
  }
}
