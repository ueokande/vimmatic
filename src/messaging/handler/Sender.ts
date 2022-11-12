import { Duplex } from "../types";

export type SenderHandler<
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> }
> = (
  type: keyof Schema,
  args: Schema[keyof Schema]["Request"]
) => Promise<Schema[keyof Schema]["Response"]>;

export default class Sender<
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> }
> {
  private readonly sender: SenderHandler<Schema>;

  constructor(sender: SenderHandler<Schema>) {
    this.sender = sender;
  }

  send<Key extends keyof Schema>(
    type: Key,
    ...args: Schema[Key]["Request"] extends undefined
      ? [undefined?]
      : [Schema[Key]["Request"]]
  ): Promise<Schema[Key]["Response"]> {
    return this.sender(type, args.length > 0 ? args[0] : undefined);
  }
}
