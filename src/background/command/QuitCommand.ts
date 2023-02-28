import type Command from "./Command";
import type { Completions } from "./Command";
import type RequestContext from "../infrastructures/RequestContext";

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

  async exec(
    { sender }: RequestContext,
    force: boolean,
    _args: string
  ): Promise<void> {
    if (sender.tab.pinned && !force) {
      throw new Error("Cannot close due to tab is pinned");
    }
    await browser.tabs.remove(sender.tabId);
  }
}

export default QuitCommand;
