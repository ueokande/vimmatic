import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import type { ContentMessageClient } from "../../clients/ContentMessageClient";

@injectable()
export class FocusOperator implements Operator {
  constructor(
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
  ) {}

  name(): string {
    return "focus.input";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    return this.contentMessageClient.focusFirstInput(sender.tabId);
  }
}
