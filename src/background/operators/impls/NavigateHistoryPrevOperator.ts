import Operator from "../Operator";
import NavigateClient from "../../clients/NavigateClient";

export default class NavigateHistoryPrevOperator implements Operator {
  constructor(private readonly navigateClient: NavigateClient) {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    await this.navigateClient.historyPrev(tab.id!);
  }
}
