import { inject, injectable } from "inversify";
import { ConsoleClient } from "../../clients/ConsoleClient";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class StartFindOperator implements Operator {
  constructor(
    @inject(ConsoleClient)
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
