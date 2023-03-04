import { inject, injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ContentMessageClient from "../../clients/ContentMessageClient";

@injectable()
export default class CancelOperator implements Operator {
  constructor(
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient
  ) {}

  name(): string {
    return "focus.input";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    return this.contentMessageClient.focusFirstInput(sender.tabId);
  }
}
