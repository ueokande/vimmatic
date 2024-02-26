import type { Completions, Command, CommandContext } from "./types";
import * as urls from "../../shared/urls";
import type { SearchEngineSettings } from "../settings/SearchEngineSettings";
import type { PropertySettings } from "../settings/PropertySettings";
import OpenCommandHelper from "./OpenCommandHelper";

class WindowOpenCommand implements Command {
  constructor(
    private readonly searchEngineSettings: SearchEngineSettings,
    propertySettings: PropertySettings,
    private readonly openCommandHelper: OpenCommandHelper = new OpenCommandHelper(
      searchEngineSettings,
      propertySettings,
    ),
  ) {}

  names(): string[] {
    return ["w", "winopen"];
  }

  fullname(): string {
    return "winopen";
  }

  description(): string {
    return "Open a URL or search by keywords in new window";
  }

  getCompletions(_force: boolean, query: string): Promise<Completions> {
    return this.openCommandHelper.getCompletions(query);
  }

  async exec(
    _ctx: CommandContext,
    _force: boolean,
    args: string,
  ): Promise<void> {
    const search = await this.searchEngineSettings.get();
    const url = urls.searchUrl(args, search);
    await chrome.windows.create({ url });
  }
}

export default WindowOpenCommand;
