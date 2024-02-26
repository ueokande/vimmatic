import { inject, injectable } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";
import type { ConsoleClient } from "../../clients/ConsoleClient";

@injectable()
export default class ShowWinOpenCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

  name() {
    return "command.show.winopen";
  }

  schema() {
    return z.object({
      alter: z.boolean().default(false),
    });
  }

  async run(
    { sender }: OperatorContext,
    { alter }: z.infer<ReturnType<ShowWinOpenCommandOperator["schema"]>>,
  ): Promise<void> {
    let command = "winopen ";
    if (alter) {
      command += sender.tab?.url || "";
    }
    return this.consoleClient.showCommand(sender.tabId, command);
  }
}
