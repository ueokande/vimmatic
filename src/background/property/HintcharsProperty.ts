import type { Property, PropertyType } from "./types";

export class HintcharsProperty implements Property {
  name() {
    return "hintchars";
  }

  description() {
    return "hint characters on follow mode";
  }

  type() {
    return "string" as const;
  }

  defaultValue() {
    return "abcdefghijklmnopqrstuvwxyz";
  }

  validate(value: PropertyType) {
    if (typeof value !== "string") {
      throw new Error("not a string");
    }
    if (value.length <= 1) {
      throw new Error("hint character must be at least 2 characters");
    }
  }
}
