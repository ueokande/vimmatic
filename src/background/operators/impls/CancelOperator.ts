import { inject, injectable } from "inversify";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class CancelOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name(): string {
    return "cancel";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    return this.consoleClient.hide(sender.tabId);
  }
}
