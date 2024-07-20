import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import type { ConsoleClient } from "../../clients/ConsoleClient";

@injectable()
export class StartFindOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

  name() {
    return "find.start";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    return this.consoleClient.showFind(sender.tabId);
  }
}
