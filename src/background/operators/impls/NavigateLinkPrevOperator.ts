import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import { NavigateClient } from "../../clients/NavigateClient";

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
