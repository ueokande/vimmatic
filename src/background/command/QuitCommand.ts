import type Command from "./Command";

class QuitCommand implements Command {
  names(): string[] {
    return ["q", "quit"];
  }

  fullname(): string {
    return "quit";
  }

  async exec(force: boolean, _args: string): Promise<void> {
    const [tab] = await browser.tabs.query({ active: true });
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
