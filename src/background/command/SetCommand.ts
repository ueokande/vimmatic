import type Command from "./Command";
import type { Completions } from "./Command";
import PropertySettings from "../settings/PropertySettings";
import PropertyRegistry from "../property/PropertyRegistry";

const mustNumber = (v: any): number => {
  const num = Number(v);
  if (isNaN(num)) {
    throw new Error("Not a number: " + v);
  }
  return num;
};

class SetCommand implements Command {
  constructor(
    private readonly propretySettings: PropertySettings,
    private readonly propertyRegsitry: PropertyRegistry
  ) {}

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
    const props = this.propertyRegsitry.getProperties();
    const items = props.map((prop) => {
      if (prop.type() === "boolean") {
        return [
          {
            primary: prop.name(),
            secondary: "Enable " + prop.description(),
            value: prop.name(),
          },
          {
            primary: "no" + prop.name(),
            secondary: "Disable " + prop.description(),
            value: "no" + prop.name(),
          },
        ];
      } else {
        return [
          {
            primary: prop.name(),
            secondary: "Set " + prop.description(),
            value: prop.name(),
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
    const [name, value] = this.parseSetOption(args);
    await this.propretySettings.setProperty(name, value);
  }

  private parseSetOption(args: string): [string, string | number | boolean] {
    let [key, value]: any[] = args.split("=");
    if (value === undefined) {
      value = !key.startsWith("no");
      key = value ? key : key.slice(2);
    }
    const def = this.propertyRegsitry.getProperty(key);
    if (!def) {
      throw new Error("Unknown property: " + key);
    }
    if (
      (def.type() === "boolean" && typeof value !== "boolean") ||
      (def.type() !== "boolean" && typeof value === "boolean")
    ) {
      throw new Error("Invalid argument: " + args);
    }

    switch (def.type()) {
      case "string":
        return [key, value];
      case "number":
        return [key, mustNumber(value)];
      case "boolean":
        return [key, value];
      default:
        throw new Error("Unknown property type: " + def.type);
    }
  }
}

export default SetCommand;
