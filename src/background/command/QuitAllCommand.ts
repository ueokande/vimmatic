import type { Command, CommandContext, Completions } from "./types";

export class QuitAllCommand implements Command {
  names(): string[] {
    return ["qa", "quitall"];
  }

  fullname(): string {
    return "quitall";
  }

  description(): string {
    return "Close all tabs";
  }

  getCompletions(_force: boolean, _query: string): Promise<Completions> {
    return Promise.resolve([]);
  }

  async exec(
    _ctx: CommandContext,
    force: boolean,
    _args: string,
  ): Promise<void> {
    let tabs = await chrome.tabs.query({ currentWindow: true });
    if (!force) {
      tabs = tabs.filter((tab) => !tab.pinned);
    }
    const ids = tabs.map((tab) => tab.id as number);
    await chrome.tabs.remove(ids);
  }
}
