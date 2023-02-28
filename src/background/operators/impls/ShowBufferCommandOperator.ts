import { inject, injectable } from "inversify";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ShowBufferCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "command.show.buffer";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    const command = "buffer ";
    return this.consoleClient.showCommand(sender.tabId, command);
  }
}
