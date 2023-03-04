import { inject, injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";

@injectable()
export default class StartFindOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "find.start";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    return this.consoleClient.showFind(sender.tabId);
  }
}
