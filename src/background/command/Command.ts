interface Command {
  names(): string[];

  fullname(): string;

  exec(force: boolean, args: string): Promise<void>;
}

export default Command;
