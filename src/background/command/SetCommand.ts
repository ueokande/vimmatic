import type { Command, CommandContext, Completions } from "./types";
import type { PropertySettings } from "../settings/PropertySettings";
import type { PropertyRegistry } from "../property/PropertyRegistry";
import type { ConsoleClient } from "../clients/ConsoleClient";

const mustNumber = (v: any): number => {
  const num = Number(v);
  if (isNaN(num)) {
    throw new Error("Not a number: " + v);
  }
  return num;
};

export class SetCommand implements Command {
  constructor(
    private readonly propretySettings: PropertySettings,
    private readonly propertyRegsitry: PropertyRegistry,
    private readonly consoleClient: ConsoleClient,
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

  async exec(
    ctx: CommandContext,
    _force: boolean,
    args: string,
  ): Promise<void> {
    if (args.length === 0) {
      // set
      return this.showProperties(ctx);
    } else if (args.includes("=")) {
      // set key=value
      const [key, value]: string[] = args.split("=");
      return this.setProperty(key, value);
    } else if (args.endsWith("?")) {
      // set key?
      const key = args.slice(0, -1);
      return this.showProperty(ctx, key);
    } else {
      // set key
      // set nokey
      return this.showPropertyOrSetBoolean(ctx, args);
    }
  }

  private async showProperties(ctx: CommandContext): Promise<void> {
    const props = this.propertyRegsitry.getProperties();
    const kvs = [];
    for (const p of props) {
      const value = await this.propretySettings.getProperty(p.name());
      if (p.type() === "boolean") {
        if (value) {
          kvs.push(`${p.name()}`);
        } else {
          kvs.push(`no${p.name()}`);
        }
      } else {
        kvs.push(`${p.name()}=${value}`);
      }
    }
    await this.consoleClient.showInfo(ctx.sender.tabId, kvs.join("\n"));
  }

  private async showProperty(ctx: CommandContext, key: string): Promise<void> {
    const def = this.propertyRegsitry.getProperty(key);
    if (typeof def === "undefined") {
      throw new Error("Unknown property: " + key);
    }
    const value = await this.propretySettings.getProperty(key);

    if (def.type() === "boolean") {
      if (value) {
        await this.consoleClient.showInfo(ctx.sender.tabId, key);
      } else {
        await this.consoleClient.showInfo(ctx.sender.tabId, `no${key}`);
      }
    } else {
      const message = `${key}=${value}`;
      await this.consoleClient.showInfo(ctx.sender.tabId, message);
    }
  }

  private async setProperty(key: string, value: string): Promise<void> {
    const def = this.propertyRegsitry.getProperty(key);
    if (!def) {
      throw new Error("Unknown property: " + key);
    }
    switch (def.type()) {
      case "string":
        return this.propretySettings.setProperty(key, value);
      case "number":
        return this.propretySettings.setProperty(key, mustNumber(value));
      case "boolean":
        throw new Error("Invalid argument: " + value);
    }
  }

  private async showPropertyOrSetBoolean(
    ctx: CommandContext,
    args: string,
  ): Promise<void> {
    const def = this.propertyRegsitry.getProperty(args);
    if (def?.type() === "boolean") {
      return this.propretySettings.setProperty(def.name(), true);
    }
    if (typeof def !== "undefined") {
      return this.showProperty(ctx, def.name());
    }
    if (args.startsWith("no")) {
      const def2 = this.propertyRegsitry.getProperty(args.slice(2));
      if (def2?.type() !== "boolean") {
        throw new Error("Invalid argument: " + args);
      }
      return this.propretySettings.setProperty(def2.name(), false);
    }
  }
}
