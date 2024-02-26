import type { Property, PropertyType } from "./types";

enum ColorScheme {
  System = "system",
  Light = "light",
  Dark = "dark",
}

export default class ColorSchemeProperty implements Property {
  name() {
    return "colorscheme";
  }

  description() {
    return "color scheme of the console";
  }

  type() {
    return "string" as const;
  }

  defaultValue() {
    return ColorScheme.System;
  }

  validate(value: PropertyType) {
    if (
      value === ColorScheme.System ||
      value === ColorScheme.Light ||
      value === ColorScheme.Dark
    ) {
      return;
    }

    throw new Error(`invalid color scheme: ${value}`);
  }
}
