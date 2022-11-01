import type Command from "./Command";
import type { Completions } from "./Command";

class QuitCommand implements Command {
  names(): string[] {
    return ["q", "quit"];
  }

  fullname(): string {
    return "quit";
  }

  description(): string {
    return "Close the current tab";
  }

  getCompletions(_force: boolean, _query: string): Promise<Completions> {
    return Promise.resolve([]);
  }

  async exec(force: boolean, _args: string): Promise<void> {
    const [tab] = await browser.tabs.query({
      currentWindow: true,
      active: true,
    });
    if (!tab.id) {
      return;
    }
    if (tab.pinned && !force) {
      throw new Error("Cannot close due to tab is pinned");
    }
    await browser.tabs.remove(tab.id);
  }
}

export default QuitCommand;
