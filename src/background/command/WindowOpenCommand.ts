import type Command from "./Command";
import * as urls from "../../shared/urls";
import SearchEngineSettings from "../settings/SearchEngineSettings";

class WindowOpenCommand implements Command {
  constructor(private readonly searchEngineSettings: SearchEngineSettings) {}

  names(): string[] {
    return ["w", "winopen"];
  }

  fullname(): string {
    return "winopen";
  }

  async exec(_force: boolean, args: string): Promise<void> {
    const search = await this.searchEngineSettings.get();
    const url = urls.searchUrl(args, search);
    await browser.windows.create({ url });
  }
}

export default WindowOpenCommand;
