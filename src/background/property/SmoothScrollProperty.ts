import type Property from "./Property";
import type { PropertyType } from "./Property";

export default class SmoothScrollProperty implements Property {
  name() {
    return "smoothscroll";
  }

  description() {
    return "smooth scroll";
  }

  type() {
    return "boolean" as const;
  }

  defaultValue() {
    return false;
  }

  validate(value: PropertyType) {
    if (typeof value !== "boolean") {
      throw new Error("not a boolean");
    }
  }
}
