import type Property from "./Property";

export default class HintcharsProperty implements Property {
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
}
