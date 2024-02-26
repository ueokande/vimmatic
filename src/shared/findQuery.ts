export interface FindQuery {
  keyword: string;
  mode: "normal" | "regexp";
  ignoreCase: boolean;
}
