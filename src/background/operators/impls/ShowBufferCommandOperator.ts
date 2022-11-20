import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";

export default class ShowBufferCommandOperator implements Operator {
  constructor(private readonly consoleClient: ConsoleClient) {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    const command = "buffer ";
    return this.consoleClient.showCommand(tab.id, command);
  }
}
