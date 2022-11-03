import type Property from "./Property";

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
}
