import { inject, injectable } from "inversify";
import { ConsoleClient } from "../../clients/ConsoleClient";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class ShowBufferCommandOperator implements Operator {
  constructor(
    @inject(ConsoleClient)
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
