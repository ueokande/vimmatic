import { injectable, inject } from "inversify";
import CommandRegistory from "../command/CommandRegistory";
import { parseCommand } from "./parser";

@injectable()
export default class CommandController {
  constructor(
    @inject("CommandRegistory")
    private readonly commandRegistory: CommandRegistory
  ) {}

  // eslint-disable-next-line complexity
  async exec(line: string): Promise<void> {
    const { name, force, args } = parseCommand(line);
    if (name.length === 0) {
      return Promise.resolve();
    }

    const cmd = this.commandRegistory.getCommand(name);
    if (typeof cmd === "undefined") {
      throw new Error(`${name} command is not defined`);
    }
    await cmd.exec(force, args);
  }
}
