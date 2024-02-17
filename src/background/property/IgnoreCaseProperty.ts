import type Property from "./Property";
import type { PropertyType } from "./Property";

export default class IgnoreCaseProperty implements Property {
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
