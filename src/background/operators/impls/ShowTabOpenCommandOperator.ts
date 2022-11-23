import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";

@injectable()
export default class ShowTabOpenCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "command.show.tabopen";
  }

  schema() {
    return z.object({
      alter: z.boolean().default(false),
    });
  }

  async run({
    alter,
  }: z.infer<ReturnType<ShowTabOpenCommandOperator["schema"]>>): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    let command = "tabopen ";
    if (alter) {
      command += tab.url || "";
    }
    return this.consoleClient.showCommand(tab.id, command);
  }
}
