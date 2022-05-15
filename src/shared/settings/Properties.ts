import ColorScheme from "../ColorScheme";

export type PropertiesJSON = {
  hintchars?: string;
  smoothscroll?: boolean;
  complete?: string;
  colorscheme?: ColorScheme;
};

export type PropertyTypes = {
  hintchars: string;
  smoothscroll: string;
  complete: string;
  colorscheme: string;
};

type PropertyName = "hintchars" | "smoothscroll" | "complete" | "colorscheme";

type PropertyDef = {
  name: PropertyName;
  defaultValue: string | number | boolean;
  type: "string" | "number" | "boolean";
};

const defs: PropertyDef[] = [
  {
    name: "hintchars",
    defaultValue: "abcdefghijklmnopqrstuvwxyz",
    type: "string",
  },
  {
    name: "smoothscroll",
    defaultValue: false,
    type: "boolean",
  },
  {
    name: "complete",
    defaultValue: "sbh",
    type: "string",
  },
  {
    name: "colorscheme",
    defaultValue: ColorScheme.System,
    type: "string",
  },
];

const defaultValues = {
  hintchars: "abcdefghijklmnopqrstuvwxyz",
  smoothscroll: false,
  complete: "sbh",
  colorscheme: ColorScheme.System,
};

export default class Properties {
  public hintchars: string;

  public smoothscroll: boolean;

  public complete: string;

  public colorscheme: ColorScheme;

  constructor({
    hintchars,
    smoothscroll,
    complete,
    colorscheme,
  }: {
    hintchars?: string;
    smoothscroll?: boolean;
    complete?: string;
    colorscheme?: ColorScheme;
  } = {}) {
    this.hintchars = hintchars || defaultValues.hintchars;
    this.smoothscroll = smoothscroll || defaultValues.smoothscroll;
    this.complete = complete || defaultValues.complete;
    this.colorscheme = colorscheme || defaultValues.colorscheme;
  }

  static fromJSON(json: PropertiesJSON): Properties {
    return new Properties(json);
  }

  static types(): PropertyTypes {
    return {
      hintchars: "string",
      smoothscroll: "boolean",
      complete: "string",
      colorscheme: "string",
    };
  }

  static def(name: string): PropertyDef | undefined {
    return defs.find((p) => p.name === name);
  }

  static defs(): PropertyDef[] {
    return defs;
  }

  toJSON(): PropertiesJSON {
    return {
      hintchars: this.hintchars,
      smoothscroll: this.smoothscroll,
      complete: this.complete,
      colorscheme: this.colorscheme,
    };
  }
}
