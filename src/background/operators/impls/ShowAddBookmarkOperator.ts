import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";

@injectable()
export default class ShowAddBookmarkOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

  name() {
    return "command.show.addbookmark";
  }

  schema() {
    return z.object({
      alter: z.boolean().default(false),
    });
  }

  async run(
    { sender }: OperatorContext,
    { alter }: z.infer<ReturnType<ShowAddBookmarkOperator["schema"]>>,
  ): Promise<void> {
    let command = "addbookmark ";
    if (alter) {
      command += sender.tab.title || "";
    }
    return this.consoleClient.showCommand(sender.tabId, command);
  }
}
