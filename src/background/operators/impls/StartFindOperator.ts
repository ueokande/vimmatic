import { inject, injectable } from "inversify";
import Operator from "../Operator";
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

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    return this.consoleClient.showFind(tab.id);
  }
}
