import { inject, injectable } from "inversify";
import Operator from "../Operator";
import NavigateClient from "../../clients/NavigateClient";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class NavigateHistoryPrevOperator implements Operator {
  constructor(
    @inject("NavigateClient")
    private readonly navigateClient: NavigateClient
  ) {}

  name() {
    return "navigate.history.prev";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    await this.navigateClient.historyPrev(sender.tabId);
  }
}
