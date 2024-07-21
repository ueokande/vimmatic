import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import { ConsoleClient } from "../../clients/ConsoleClient";

@injectable()
export class CancelOperator implements Operator {
  constructor(
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
  ) {}

  name(): string {
    return "cancel";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    return this.consoleClient.hide(sender.tabId);
  }
}
