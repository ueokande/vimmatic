import { inject, injectable } from "inversify";
import Operator from "../Operator";
import ContentMessageClient from "../../clients/ContentMessageClient";
import RequestContext from "../../infrastructures/RequestContext";

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

  async run({ sender }: RequestContext): Promise<void> {
    return this.contentMessageClient.focusFirstInput(sender.tabId);
  }
}
