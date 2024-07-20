import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import type { ConsoleClient } from "../../clients/ConsoleClient";

@injectable()
export class ShowCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

  name() {
    return "command.show";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    return this.consoleClient.showCommand(sender.tabId, "");
  }
}
