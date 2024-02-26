export type CompletionItem = {
  icon?: string;
  primary?: string;
  secondary?: string;
  value: string;
};

export type CompletionGroup = {
  name: string;
  items: Array<CompletionItem>;
};

export type Completions = CompletionGroup[];
