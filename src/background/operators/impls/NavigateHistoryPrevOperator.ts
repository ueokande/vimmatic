import { inject, injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import NavigateClient from "../../clients/NavigateClient";

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

  async run({ sender }: OperatorContext): Promise<void> {
    await this.navigateClient.historyPrev(sender.tabId);
  }
}
