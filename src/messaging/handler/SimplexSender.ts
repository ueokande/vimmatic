import type { Simplex } from "../types";

type SimplexSenderHandler<
  Schema extends { [Key in keyof Schema]: Simplex<unknown> },
> = (type: keyof Schema, args: Schema[keyof Schema]["Request"]) => void;

export default class SimplexSender<
  Schema extends { [Key in keyof Schema]: Simplex<unknown> },
> {
  private readonly sender: SimplexSenderHandler<Schema>;

  constructor(sender: SimplexSenderHandler<Schema>) {
    this.sender = sender;
  }

  send<Key extends keyof Schema>(
    type: Key,
    ...args: Schema[Key]["Request"] extends undefined
      ? [undefined?]
      : [Schema[Key]["Request"]]
  ): void {
    this.sender(type, args.length > 0 ? args[0] : undefined);
  }
}
