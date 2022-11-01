import type {
  Completions as CompletionsType,
  CompletionGroup as CompletionGroupType,
  CompletionItem as CompletionItemType,
} from "../../shared/Completions";

export type Completions = CompletionsType;
export type CompletionGroup = CompletionGroupType;
export type CompletionItem = CompletionItemType;

interface Command {
  names(): string[];

  fullname(): string;

  description(): string;

  getCompletions(force: boolean, query: string): Promise<Completions>;

  exec(force: boolean, args: string): Promise<void>;
}

export default Command;
