import type {
  Completions as CompletionsType,
  CompletionGroup as CompletionGroupType,
  CompletionItem as CompletionItemType,
} from "../../shared/completions";

export type Completions = CompletionsType;
export type CompletionGroup = CompletionGroupType;
export type CompletionItem = CompletionItemType;

export type CommandContext = {
  sender: {
    tabId: number;
    frameId: number;
    tab: chrome.tabs.Tab;
  };
};

export interface Command {
  names(): string[];

  fullname(): string;

  description(): string;

  getCompletions(force: boolean, query: string): Promise<Completions>;

  exec(ctx: CommandContext, force: boolean, args: string): Promise<void>;
}
