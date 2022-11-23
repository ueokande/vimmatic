import { inject, injectable } from "inversify";
import Operator from "../Operator";
import NavigateClient from "../../clients/NavigateClient";

@injectable()
export default class NavigateHistoryNextOperator implements Operator {
  constructor(
    @inject("NavigateClient")
    private readonly navigateClient: NavigateClient
  ) {}

  name() {
    return "navigate.history.next";
  }

  schema() {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    await this.navigateClient.historyNext(tab.id!);
  }
}
