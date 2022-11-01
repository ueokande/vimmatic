import type Command from "./Command";
import type { Completions } from "./Command";
import * as urls from "../../shared/urls";
import SearchEngineSettings from "../settings/SearchEngineSettings";
import PropertySettings from "../settings/PropertySettings";
import OpenCommandHelper from "./OpenCommandHelper";

class OpenCommand implements Command {
  constructor(
    private readonly searchEngineSettings: SearchEngineSettings,
    propertySettings: PropertySettings,
    private readonly openCommandHelper: OpenCommandHelper = new OpenCommandHelper(
      searchEngineSettings,
      propertySettings
    )
  ) {}

  names(): string[] {
    return ["o", "open"];
  }

  fullname(): string {
    return "open";
  }

  description(): string {
    return "Open a URL or search by keywords in current tab";
  }

  getCompletions(_force: boolean, query: string): Promise<Completions> {
    return this.openCommandHelper.getCompletions(query);
  }

  async exec(_force: boolean, args: string): Promise<void> {
    const search = await this.searchEngineSettings.get();
    const url = urls.searchUrl(args, search);
    await browser.tabs.update({ url });
  }
}

export default OpenCommand;
