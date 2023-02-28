import { injectable } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class DuplicateTabOperator implements Operator {
  name(): string {
    return "tabs.duplicate";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    await browser.tabs.duplicate(sender.tabId);
  }
}
