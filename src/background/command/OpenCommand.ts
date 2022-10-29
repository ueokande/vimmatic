import type Command from "./Command";
import * as urls from "../../shared/urls";
import SearchEngineSettings from "../settings/SearchEngineSettings";

class OpenCommand implements Command {
  constructor(private readonly searchEngineSettings: SearchEngineSettings) {}

  names(): string[] {
    return ["o", "open"];
  }

  fullname(): string {
    return "open";
  }

  async exec(_force: boolean, args: string): Promise<void> {
    const search = await this.searchEngineSettings.get();
    const url = urls.searchUrl(args, search);
    await browser.tabs.update({ url });
  }
}

export default OpenCommand;
