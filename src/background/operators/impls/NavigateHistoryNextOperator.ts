import { inject, injectable } from "inversify";
import { NavigateClient } from "../../clients/NavigateClient";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class NavigateHistoryNextOperator implements Operator {
  constructor(
    @inject(NavigateClient)
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
