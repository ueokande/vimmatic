import type Command from "./Command";
import type TabFilter from "./TabFilter";

class BufferDeleteCommand implements Command {
  constructor(private readonly tabFilter: TabFilter) {}

  names(): string[] {
    return ["bd", "bdel", "bdelete"];
  }

  fullname(): string {
    return "bdelete";
  }

  async exec(force: boolean, args: string): Promise<void> {
    const keywords = args.trim();
    let tabs = await this.tabFilter.getByKeyword(keywords);
    if (!force) {
      tabs = tabs.filter((tab) => !tab.pinned);
    }
    if (tabs.length === 0) {
      throw new Error("No matching buffer for " + keywords);
    } else if (tabs.length > 1) {
      throw new Error("More than one match for " + keywords);
    }
    return browser.tabs.remove(tabs[0].id!);
  }
}

export default BufferDeleteCommand;
