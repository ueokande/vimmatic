import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class TogglePinnedTabOperator implements Operator {
  name(): string {
    return "tabs.pin.toggle";
  }

  schema() {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    await browser.tabs.update(tab.id, { pinned: !tab.pinned });
  }
}
