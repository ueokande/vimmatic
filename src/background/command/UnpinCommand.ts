import type { Command, CommandContext, Completions } from "./types";
import type { TabQueryHelper } from "./TabQueryHelper";
import type { ConsoleClient } from "../clients/ConsoleClient";

export class UnpinCommand implements Command {
  constructor(
    private readonly tabQueryHelper: TabQueryHelper,
    private readonly consoleClient: ConsoleClient,
  ) {}

  names(): string[] {
    return ["unpin"];
  }

  fullname(): string {
    return "unpin";
  }

  description(): string {
    return "Make a tab unpinned";
  }

  getCompletions(_force: boolean, query: string): Promise<Completions> {
    return this.tabQueryHelper.getCompletions(query, {
      includePinned: true,
    });
  }

  async exec(
    { sender }: CommandContext,
    _force: boolean,
    args: string,
  ): Promise<void> {
    let targetTabId: number | undefined;
    const keywords = args.trim();
    if (keywords.length === 0) {
      targetTabId = sender.tabId;
    } else {
      const tabs = await this.tabQueryHelper.queryTabs(keywords, {
        includePinned: true,
      });
      if (tabs.length === 0) {
        throw new Error("No matching buffer for " + keywords);
      }

      targetTabId = tabs[0].id!;
    }

    await chrome.tabs.update(targetTabId, { pinned: false });
    await this.consoleClient.showInfo(sender.tabId, "Unpinned tab");
  }
}
