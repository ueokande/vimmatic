import Operator from "../Operator";
import LastSelectedTab from "../../tabs/LastSelectedTab";

export default class SelectPreviousSelectedTabOperator implements Operator {
  constructor(private readonly lastSelectedTab: LastSelectedTab) {}

  async run(): Promise<void> {
    const lastTabId = this.lastSelectedTab.get();
    if (!lastTabId) {
      return;
    }
    await browser.tabs.update(lastTabId, { active: true });
  }
}
