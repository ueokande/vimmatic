import type Command from "./Command";
import type { Completions } from "./Command";
import type ConsoleClient from "../clients/ConsoleClient";

class AddBookmarkCommand implements Command {
  constructor(private readonly consoleClient: ConsoleClient) {}

  names(): string[] {
    return ["addbookmark"];
  }

  fullname(): string {
    return "addbookmark";
  }

  description(): string {
    return "Add current page to bookmarks";
  }

  getCompletions(_force: boolean, _query: string): Promise<Completions> {
    return Promise.resolve([]);
  }

  async exec(_force: boolean, args: string): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    let title = args.trim();
    if (title.length === 0) {
      if (tab.title && tab.title.length > 0) {
        title = tab.title;
      } else if (tab.url) {
        title = tab.url;
      }
    }
    const item = await browser.bookmarks.create({
      type: "bookmark",
      title,
      url: tab.url,
    });
    if (!item) {
      throw new Error("Could not create a bookmark");
    }

    const message = "Saved current page: " + item.url;
    return this.consoleClient.showInfo(tab.id as number, message);
  }
}

export default AddBookmarkCommand;
