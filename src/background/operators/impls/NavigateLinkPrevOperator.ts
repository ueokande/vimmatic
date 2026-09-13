import { inject, injectable } from "inversify";
import { NavigateClient } from "../../clients/NavigateClient";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class NavigateLinkPrevOperator implements Operator {
  constructor(
    @inject(NavigateClient)
    private readonly navigateClient: NavigateClient,
  ) {}

  name() {
    return "navigate.link.prev";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.navigateClient.linkPrev(sender.tabId);
  }
}
