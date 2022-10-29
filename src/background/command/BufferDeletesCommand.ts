import type Command from "./Command";
import type TabFilter from "./TabFilter";

class BDeletesCommand implements Command {
  constructor(private readonly tabFilter: TabFilter) {}

  names(): string[] {
    return ["bdeletes"];
  }

  fullname(): string {
    return "bdeletes";
  }

  async exec(force: boolean, args: string): Promise<void> {
    const keywords = args.trim();
    let tabs = await this.tabFilter.getByKeyword(keywords);
    if (!force) {
      tabs = tabs.filter((tab) => !tab.pinned);
    }
    if (tabs.length === 0) {
      throw new Error("No matching buffer for " + keywords);
    }
    const ids = tabs.map((tab) => tab.id as number);
    await browser.tabs.remove(ids);
  }
}

export default BDeletesCommand;
