import { inject, injectable } from "inversify";
import Operator from "../Operator";
import LastSelectedTab from "../../tabs/LastSelectedTab";

@injectable()
export default class SelectPreviousSelectedTabOperator implements Operator {
  constructor(
    @inject("LastSelectedTab")
    private readonly lastSelectedTab: LastSelectedTab
  ) {}

  name() {
    return "tabs.prevsel";
  }

  schema() {}

  async run(): Promise<void> {
    const lastTabId = this.lastSelectedTab.get();
    if (!lastTabId) {
      return;
    }
    await browser.tabs.update(lastTabId, { active: true });
  }
}
