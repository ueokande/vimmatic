import type Command from "./Command";

const url = "https://ueokande.github.io/vimmatic/";

class HelpCommand implements Command {
  names(): string[] {
    return ["h", "help"];
  }

  fullname(): string {
    return "help";
  }

  async exec(_force: boolean, _args: string): Promise<void> {
    await browser.tabs.create({ url, active: true });
  }
}

export default HelpCommand;
