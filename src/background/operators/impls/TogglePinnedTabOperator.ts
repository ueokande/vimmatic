import { injectable } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class TogglePinnedTabOperator implements Operator {
  name(): string {
    return "tabs.pin.toggle";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    await browser.tabs.update({ pinned: !sender.tab.pinned });
  }
}
