import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import type { ConsoleClient } from "../../clients/ConsoleClient";

@injectable()
export class ShowBufferCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

  name() {
    return "command.show.buffer";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    const command = "buffer ";
    return this.consoleClient.showCommand(sender.tabId, command);
  }
}
