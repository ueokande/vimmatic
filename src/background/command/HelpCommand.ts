import type Command from "./Command";
import type { CommandContext } from "./Command";
import type { Completions } from "./Command";

const url = "https://ueokande.github.io/vimmatic/";

class HelpCommand implements Command {
  names(): string[] {
    return ["h", "help"];
  }

  fullname(): string {
    return "help";
  }

  description(): string {
    return "Open Vimmatic help in new tab";
  }

  getCompletions(_force: boolean, _query: string): Promise<Completions> {
    return Promise.resolve([]);
  }

  async exec(
    _ctx: CommandContext,
    _force: boolean,
    _args: string
  ): Promise<void> {
    await chrome.tabs.create({ url, active: true });
  }
}

export default HelpCommand;
