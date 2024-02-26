import type { Property, PropertyType } from "./types";

enum Complete {
  SearchEngines = "s",
  Bookmarks = "b",
  History = "h",
}

export default class CompleteProperty implements Property {
  name() {
    return "complete";
  }

  description() {
    return "which are completed at the open page";
  }

  type() {
    return "string" as const;
  }

  defaultValue() {
    return "sbh";
  }

  validate(value: PropertyType) {
    if (typeof value !== "string") {
      throw new Error("not a string");
    }
    Array.from(value as string).forEach((ch) => {
      if (
        ch !== Complete.SearchEngines &&
        ch !== Complete.Bookmarks &&
        ch !== Complete.History
      ) {
        throw new Error(`invalid character: ${ch}`);
      }
    });
  }
}
