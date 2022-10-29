import type Command from "./Command";
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

  async exec(_force: boolean, args: string): Promise<void> {
    if (args.length === 0) {
      return;
    }
    const [name, value] = parseSetOption(args);
    await this.propretySettings.setProperty(name, value);
  }
}

export default SetCommand;
