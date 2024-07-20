import type { Command, CommandContext, Completions } from "./types";
import type { BufferCommandHelper } from "./BufferCommandHelper";

export class BufferDeleteCommand implements Command {
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
    _ctx: CommandContext,
    force: boolean,
    args: string,
  ): Promise<void> {
    const keywords = args.trim();
    const tabs = await this.bufferCommandHelper.queryTabs(force, keywords);
    if (tabs.length === 0) {
      throw new Error("No matching buffer for " + keywords);
    } else if (tabs.length > 1) {
      throw new Error("More than one match for " + keywords);
    }
    return chrome.tabs.remove(tabs[0].id!);
  }
}
