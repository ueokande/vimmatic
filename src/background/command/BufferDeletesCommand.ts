import type { Command, CommandContext, Completions } from "./types";
import type { TabQueryHelper } from "./TabQueryHelper";

export class BufferDeletesCommand implements Command {
  constructor(private readonly tabQueryHelper: TabQueryHelper) {}

  names(): string[] {
    return ["bdeletes"];
  }

  fullname(): string {
    return "bdeletes";
  }

  description(): string {
    return "Close all tabs matched by keywords";
  }

  async getCompletions(force: boolean, query: string): Promise<Completions> {
    return this.tabQueryHelper.getCompletions(query, {
      includePinned: force,
    });
  }

  async exec(
    _ctx: CommandContext,
    force: boolean,
    args: string,
  ): Promise<void> {
    const keywords = args.trim();
    const tabs = await this.tabQueryHelper.queryTabs(keywords, {
      includePinned: force,
    });
    if (tabs.length === 0) {
      throw new Error("No matching buffer for " + keywords);
    }
    const ids = tabs.map((tab) => tab.id as number);
    await chrome.tabs.remove(ids);
  }
}
