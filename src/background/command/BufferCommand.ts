import type Command from "./Command";
import type TabFilter from "./TabFilter";
import type LastSelectedTab from "./LastSelectedTab";

class BufferCommand implements Command {
  constructor(
    private readonly tabFilter: TabFilter,
    private readonly lastSelectedTab: LastSelectedTab
  ) {}

  names(): string[] {
    return ["b", "buffer"];
  }

  fullname(): string {
    return "buffer";
  }

  // eslint-disable-next-line max-statements
  async exec(_force: boolean, args: string): Promise<void> {
    const keywords = args.trim();
    if (keywords.length === 0) {
      return;
    }

    if (!isNaN(Number(keywords))) {
      const tabs = await browser.tabs.query({ currentWindow: true });
      const index = parseInt(keywords, 10) - 1;
      if (index < 0 || tabs.length <= index) {
        throw new RangeError(`tab ${index + 1} does not exist`);
      }
      await browser.tabs.update(tabs[index].id, { active: true });
      return;
    } else if (keywords.trim() === "%") {
      // Select current window
      return;
    } else if (keywords.trim() === "#") {
      // Select last selected window
      const lastId = await this.lastSelectedTab.get();
      if (typeof lastId === "undefined" || lastId === null) {
        throw new Error("No last selected tab");
      }
      await browser.tabs.update(lastId, { active: true });
      return;
    }

    const [current] = await browser.tabs.query({ active: true });
    const tabs = await this.tabFilter.getByKeyword(keywords);
    if (tabs.length === 0) {
      throw new RangeError("No matching buffer for " + keywords);
    }
    for (const tab of tabs) {
      if (tab.index > current.index) {
        await browser.tabs.update(tab.id, { active: true });
        return;
      }
    }
    await browser.tabs.update(tabs[0].id, { active: true });
  }
}

export default BufferCommand;
