import type { Command, CommandContext, Completions } from "./types";
import type { TabQueryHelper } from "./TabQueryHelper";
import type { ConsoleClient } from "../clients/ConsoleClient";

export class TogglePinCommand implements Command {
  constructor(
    private readonly tabQueryHelper: TabQueryHelper,
    private readonly consoleClient: ConsoleClient,
  ) {}

  names(): string[] {
    return ["togglepin"];
  }

  fullname(): string {
    return "togglepin";
  }

  description(): string {
    return "Toggle a tab's pinning";
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
    let targetTab: chrome.tabs.Tab | undefined;
    const keywords = args.trim();
    if (keywords.length === 0) {
      targetTab = sender.tab;
    } else {
      const tabs = await this.tabQueryHelper.queryTabs(keywords, {
        includePinned: true,
      });
      if (tabs.length === 0) {
        throw new Error("No matching buffer for " + keywords);
      }
      targetTab = tabs[0];
    }
    if (typeof targetTab.id !== "number") {
      return;
    }

    await chrome.tabs.update(targetTab.id, { pinned: !targetTab.pinned });
    await this.consoleClient.showInfo(sender.tabId, "Toggled tab pinning");
  }
}
