import type Command from "./Command";
import type { Completions } from "./Command";
import Properties from "../../shared/settings/Properties";
import PropertySettings from "../settings/PropertySettings";

const mustNumber = (v: any): number => {
  const num = Number(v);
  if (isNaN(num)) {
    throw new Error("Not a number: " + v);
  }
  return num;
};

const parseSetOption = (args: string): [string, string | number | boolean] => {
  let [key, value]: any[] = args.split("=");
  if (value === undefined) {
    value = !key.startsWith("no");
    key = value ? key : key.slice(2);
  }
  const def = Properties.def(key);
  if (!def) {
    throw new Error("Unknown property: " + key);
  }
  if (
    (def.type === "boolean" && typeof value !== "boolean") ||
    (def.type !== "boolean" && typeof value === "boolean")
  ) {
    throw new Error("Invalid argument: " + args);
  }

  switch (def.type) {
    case "string":
      return [key, value];
    case "number":
      return [key, mustNumber(value)];
    case "boolean":
      return [key, value];
    default:
      throw new Error("Unknown property type: " + def.type);
  }
};

class SetCommand implements Command {
  constructor(private readonly propretySettings: PropertySettings) {}

  names(): string[] {
    return ["set"];
  }

  fullname(): string {
    return "set";
  }

  description(): string {
    return "Set a value of the property";
  }

  getCompletions(_force: boolean, query: string): Promise<Completions> {
    const items = Properties.defs().map(({ name, type, description }) => {
      if (type === "boolean") {
        return [
          {
            primary: name,
            secondary: "Enable " + description,
            value: name,
          },
          {
            primary: "no" + name,
            secondary: "Disable " + description,
            value: "no" + name,
          },
        ];
      } else {
        return [
          {
            primary: name,
            secondary: "Set " + description,
            value: name,
          },
        ];
      }
    });

    return Promise.resolve([
      {
        name: "Properties",
        items: items.flat().filter((item) => item.primary.startsWith(query)),
      },
    ]);
  }

  async exec(_force: boolean, args: string): Promise<void> {
    if (args.length === 0) {
      return;
    }
    const [name, value] = parseSetOption(args);
    await this.propretySettings.setProperty(name, value);
  }
}

export default SetCommand;
