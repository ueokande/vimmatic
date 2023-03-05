import type Command from "./Command";
import type { CommandContext } from "./Command";
import type { Completions } from "./Command";
import type LastSelectedTab from "../tabs/LastSelectedTab";
import BufferCommandHelper from "./BufferCommandHelper";

class BufferCommand implements Command {
  constructor(
    private readonly lastSelectedTab: LastSelectedTab,
    private readonly bufferCommandHelper = new BufferCommandHelper(
      lastSelectedTab
    )
  ) {}

  names(): string[] {
    return ["b", "buffer"];
  }

  fullname(): string {
    return "buffer";
  }

  description(): string {
    return "Select tabs by matched keywords";
  }

  async getCompletions(_force: boolean, query: string): Promise<Completions> {
    return this.bufferCommandHelper.getCompletions(true, query);
  }

  // eslint-disable-next-line max-statements
  async exec(
    _ctx: CommandContext,
    _force: boolean,
    args: string
  ): Promise<void> {
    const keywords = args.trim();
    if (keywords.length === 0) {
      return;
    }

    if (!isNaN(Number(keywords))) {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const index = parseInt(keywords, 10) - 1;
      if (index < 0 || tabs.length <= index) {
        throw new RangeError(`tab ${index + 1} does not exist`);
      }
      const tabId = tabs[index].id;
      if (typeof tabId === "undefined") {
        throw new Error(`tab ${index + 1} has not id`);
      }
      await chrome.tabs.update(tabId, { active: true });
      return;
    } else if (keywords.trim() === "%") {
      // Select current window
      return;
    } else if (keywords.trim() === "#") {
      // Select last selected window
      const lastId = this.lastSelectedTab.get();
      if (typeof lastId === "undefined" || lastId === null) {
        throw new Error("No last selected tab");
      }
      await chrome.tabs.update(lastId, { active: true });
      return;
    }

    const [current] = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
    const tabs = await this.bufferCommandHelper.queryTabs(true, keywords);
    if (tabs.length === 0) {
      throw new RangeError("No matching buffer for " + keywords);
    }
    for (const tab of tabs) {
      if (tab.index > current.index) {
        if (typeof tab.id === "undefined") {
          throw new Error(`tab ${tab.index} has not id`);
        }
        await chrome.tabs.update(tab.id, { active: true });
        return;
      }
    }
    const tabId = tabs[0].id;
    if (typeof tabId === "undefined") {
      throw new Error(`tab ${tabs[0].index} has not id`);
    }
    await chrome.tabs.update(tabId, { active: true });
  }
}

export default BufferCommand;
