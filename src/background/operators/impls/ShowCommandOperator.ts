import { inject, injectable } from "inversify";
import { ConsoleClient } from "../../clients/ConsoleClient";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class ShowCommandOperator implements Operator {
  constructor(
    @inject(ConsoleClient)
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
