import { inject, injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import NavigateClient from "../../clients/NavigateClient";

@injectable()
export default class NavigateHistoryNextOperator implements Operator {
  constructor(
    @inject("NavigateClient")
    private readonly navigateClient: NavigateClient,
  ) {}

  name() {
    return "navigate.history.next";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.navigateClient.historyNext(sender.tabId);
  }
}
