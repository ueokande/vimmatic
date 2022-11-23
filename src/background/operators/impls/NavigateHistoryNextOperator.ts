import { inject, injectable } from "inversify";
import Operator from "../Operator";
import NavigateClient from "../../clients/NavigateClient";
import RequestContext from "../../infrastructures/RequestContext";

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

  async run({ sender }: RequestContext): Promise<void> {
    if (!sender?.tab?.id) {
      return;
    }
    await this.navigateClient.historyNext(sender.tab.id);
  }
}
