import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";

export default class ShowTabOpenCommandOperator implements Operator {
  constructor(
    private readonly consoleClient: ConsoleClient,
    private readonly alter: boolean
  ) {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    let command = "tabopen ";
    if (this.alter) {
      command += tab.url || "";
    }
    return this.consoleClient.showCommand(tab.id, command);
  }
}
