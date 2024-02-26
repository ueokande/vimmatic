import { injectable, inject } from "inversify";
import type { Completions } from "../../shared/completions";
import type { CommandRegistry } from "../command/CommandRegistry";
import type { RequestContext } from "../messaging/types";
import type { CommandContext } from "../command/types";
import { parseCommand, onCommandInputting } from "./parser";

@injectable()
export default class CommandUseCase {
  constructor(
    @inject("CommandRegistry")
    private readonly commandRegistry: CommandRegistry,
  ) {}

  async exec(ctx: RequestContext, text: string): Promise<void> {
    if (
      typeof ctx.sender.tab?.id === "undefined" ||
      typeof ctx.sender.frameId === "undefined"
    ) {
      return;
    }
    const cmdCtx: CommandContext = {
      sender: {
        tabId: ctx.sender.tab.id,
        frameId: ctx.sender.frameId,
        tab: ctx.sender.tab,
      },
    };

    const { name, force, args } = parseCommand(text);
    if (name.length === 0) {
      return Promise.resolve();
    }

    const cmd = this.commandRegistry.getCommand(name);
    if (typeof cmd === "undefined") {
      throw new Error(`${name} command is not defined`);
    }
    await cmd.exec(cmdCtx, force, args);
  }

  async getCompletions(query: string): Promise<Completions> {
    if (onCommandInputting(query)) {
      const cmds = this.commandRegistry.getCommands();
      const items = cmds
        .filter((cmd) => cmd.fullname().startsWith(query))
        .map((cmd) => ({
          primary: cmd.fullname(),
          secondary: cmd.description(),
          value: cmd.fullname(),
        }));
      return Promise.resolve([
        {
          name: "Console Command",
          items,
        },
      ]);
    }

    const { name, force, args } = parseCommand(query);
    if (name.length === 0) {
      return Promise.resolve([]);
    }

    const cmd = this.commandRegistry.getCommand(name);
    if (typeof cmd === "undefined") {
      throw new Error(`${name} command is not defined`);
    }
    const completions = await cmd.getCompletions(force, args);
    // add original command to completed value
    completions.forEach((group) => {
      group.items.forEach((item) => {
        item.value = name + " " + item.value;
      });
    });
    return completions;
  }
}
