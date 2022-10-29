import type Command from "./Command";
import * as urls from "../../shared/urls";
import SearchEngineSettings from "../settings/SearchEngineSettings";

class TabOpenCommand implements Command {
  constructor(private readonly searchEngineSettings: SearchEngineSettings) {}

  names(): string[] {
    return ["t", "tabopen"];
  }

  fullname(): string {
    return "tabopen";
  }

  async exec(_force: boolean, args: string): Promise<void> {
    const search = await this.searchEngineSettings.get();
    const url = urls.searchUrl(args, search);
    await browser.tabs.create({ url });
  }
}

export default TabOpenCommand;
