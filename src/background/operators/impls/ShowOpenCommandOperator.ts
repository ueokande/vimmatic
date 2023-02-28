import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ShowOpenCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "command.show.open";
  }

  schema() {
    return z.object({
      alter: z.boolean().default(false),
    });
  }

  async run(
    { sender }: RequestContext,
    { alter }: z.infer<ReturnType<ShowOpenCommandOperator["schema"]>>
  ): Promise<void> {
    let command = "open ";
    if (alter) {
      command += sender.tab.url || "";
    }
    return this.consoleClient.showCommand(sender.tabId, command);
  }
}
