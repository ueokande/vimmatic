import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";

@injectable()
export default class ShowWinOpenCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "command.show.winopen";
  }

  schema() {
    return z.object({
      alter: z.boolean().default(false),
    });
  }

  async run({
    alter,
  }: z.infer<ReturnType<ShowWinOpenCommandOperator["schema"]>>): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    let command = "winopen ";
    if (alter) {
      command += tab.url || "";
    }
    return this.consoleClient.showCommand(tab.id, command);
  }
}
