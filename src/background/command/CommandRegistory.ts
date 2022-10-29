import Command from "./Command";

export default interface CommandRegistory {
  register(cmd: Command): void;

  getCommand(name: string): Command | undefined;
}

export class CommandRegistoryImpl implements CommandRegistory {
  private readonly commands: Map<string, Command> = new Map();

  register(cmd: Command): void {
    if (!cmd.names().includes(cmd.fullname())) {
      throw new Error(
        `names of the command ${cmd.fullname} does not contains full-name`
      );
    }

    for (const name of cmd.names()) {
      const registered = this.commands.get(name);
      if (typeof registered === "undefined") {
        continue;
      }
      throw new Error(
        `command name ${name} is already registered by ${registered.fullname()}`
      );
    }

    for (const name of cmd.names()) {
      this.commands.set(name, cmd);
    }
  }

  getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }
}
