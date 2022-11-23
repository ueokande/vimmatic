import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";
import RequestContext from "../../infrastructures/RequestContext";

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

  async run(
    { sender }: RequestContext,
    { alter }: z.infer<ReturnType<ShowTabOpenCommandOperator["schema"]>>
  ): Promise<void> {
    if (!sender?.tab?.id) {
      return;
    }
    let command = "tabopen ";
    if (alter) {
      command += sender.tab?.url || "";
    }
    return this.consoleClient.showCommand(sender.tab.id, command);
  }
}
