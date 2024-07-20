import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import type { NavigateClient } from "../../clients/NavigateClient";

@injectable()
export class NavigateHistoryPrevOperator implements Operator {
  constructor(
    @inject("NavigateClient")
    private readonly navigateClient: NavigateClient,
  ) {}

  name() {
    return "navigate.history.prev";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.navigateClient.historyPrev(sender.tabId);
  }
}
