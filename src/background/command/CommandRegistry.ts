import Command from "./Command";

export default interface CommandRegistry {
  register(cmd: Command): void;

  getCommand(name: string): Command | undefined;

  getCommands(): Command[];
}

export class CommandRegistryImpl implements CommandRegistry {
  private readonly commands: Command[] = [];
  private readonly commandNames: Map<string, Command> = new Map();

  register(cmd: Command): void {
    if (!cmd.names().includes(cmd.fullname())) {
      throw new Error(
        `names of the command ${cmd.fullname} does not contains full-name`,
      );
    }

    for (const name of cmd.names()) {
      const registered = this.commandNames.get(name);
      if (typeof registered === "undefined") {
        continue;
      }
      throw new Error(
        `command name ${name} is already registered by ${registered.fullname()}`,
      );
    }

    for (const name of cmd.names()) {
      this.commandNames.set(name, cmd);
    }
    this.commands.push(cmd);
  }

  getCommand(name: string): Command | undefined {
    return this.commandNames.get(name);
  }

  getCommands(): Command[] {
    return this.commands;
  }
}
