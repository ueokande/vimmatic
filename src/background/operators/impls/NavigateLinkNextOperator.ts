import { inject, injectable } from "inversify";
import { NavigateClient } from "../../clients/NavigateClient";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class NavigateLinkNextOperator implements Operator {
  constructor(
    @inject(NavigateClient)
    private readonly navigateClient: NavigateClient,
  ) {}

  name() {
    return "navigate.link.next";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.navigateClient.linkNext(sender.tabId);
  }
}
