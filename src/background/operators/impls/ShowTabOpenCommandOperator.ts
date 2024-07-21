import { inject, injectable } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";
import { ConsoleClient } from "../../clients/ConsoleClient";

@injectable()
export class ShowTabOpenCommandOperator implements Operator {
  constructor(
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
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
    { sender }: OperatorContext,
    { alter }: z.infer<ReturnType<ShowTabOpenCommandOperator["schema"]>>,
  ): Promise<void> {
    let command = "tabopen ";
    if (alter) {
      command += sender.tab?.url || "";
    }
    return this.consoleClient.showCommand(sender.tabId, command);
  }
}
