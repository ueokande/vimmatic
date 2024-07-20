import type { Property, PropertyType } from "./types";

enum FindMode {
  Normal = "normal",
  RegExp = "regexp",
}

export class FindModeProperty implements Property {
  name() {
    return "findmode";
  }

  description() {
    return "Find mode (normal or regexp)";
  }

  type() {
    return "string" as const;
  }

  defaultValue() {
    return FindMode.Normal;
  }

  validate(value: PropertyType) {
    if (value === FindMode.RegExp || value === FindMode.Normal) {
      return;
    }

    throw new Error(`invalid color scheme: ${value}`);
  }
}
