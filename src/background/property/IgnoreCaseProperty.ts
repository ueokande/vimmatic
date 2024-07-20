import type { Property, PropertyType } from "./types";

export class IgnoreCaseProperty implements Property {
  name() {
    return "ignorecase";
  }

  description() {
    return "Ignore case in the find mode";
  }

  type() {
    return "boolean" as const;
  }

  defaultValue() {
    // prefer the browser setting instead of vim's default
    return true;
  }

  validate(value: PropertyType) {
    if (typeof value !== "boolean") {
      throw new Error("not a boolean");
    }
  }
}
