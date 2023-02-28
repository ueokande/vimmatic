import type Command from "./Command";
import type { Completions } from "./Command";
import type BufferCommandHelper from "./BufferCommandHelper";
import type RequestContext from "../infrastructures/RequestContext";

class BufferDeleteCommand implements Command {
  constructor(private readonly bufferCommandHelper: BufferCommandHelper) {}

  names(): string[] {
    return ["bd", "bdel", "bdelete"];
  }

  fullname(): string {
    return "bdelete";
  }

  description(): string {
    return "Close a certain tab matched by keywords";
  }

  async getCompletions(force: boolean, query: string): Promise<Completions> {
    return this.bufferCommandHelper.getCompletions(force, query);
  }

  async exec(
    _ctx: RequestContext,
    force: boolean,
    args: string
  ): Promise<void> {
    const keywords = args.trim();
    const tabs = await this.bufferCommandHelper.queryTabs(force, keywords);
    if (tabs.length === 0) {
      throw new Error("No matching buffer for " + keywords);
    } else if (tabs.length > 1) {
      throw new Error("More than one match for " + keywords);
    }
    return browser.tabs.remove(tabs[0].id!);
  }
}

export default BufferDeleteCommand;
