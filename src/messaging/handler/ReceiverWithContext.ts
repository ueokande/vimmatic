import { Duplex } from "../types";

type HandlerWithContext<
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
  Context
> = (
  ctx: Context,
  args: Schema[keyof Schema]["Request"]
) => Promise<Schema[keyof Schema]["Response"]> | void;

type SingleHandlerWithContext<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
  Context
> = (
  ctx: Context,
  args: Schema[Key]["Request"]
) => Promise<Schema[Key]["Response"]> | void;

export class RouterWithContext<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
  Context
> {
  constructor(
    private readonly type: Key,
    private readonly routes: Map<
      keyof Schema,
      HandlerWithContext<Schema, Context>
    >
  ) {}

  to(handler: SingleHandlerWithContext<Key, Schema, Context>) {
    this.routes.set(this.type, handler);
  }
}

export default class ReceiverWithContext<
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
  Context
> {
  private readonly routes: Map<
    keyof Schema,
    HandlerWithContext<Schema, Context>
  > = new Map();

  route<Key extends keyof Schema>(
    type: Key
  ): RouterWithContext<Key, Schema, Context> {
    if (this.routes.has(type)) {
      throw new Error(`The route on "${String(type)}" is already exists`);
    }
    return new RouterWithContext<Key, Schema, Context>(type, this.routes);
  }

  receive(
    ctx: Context,
    type: unknown,
    args: unknown
  ): Schema[keyof Schema]["Response"] {
    const route = this.routes.get(type as keyof Schema);
    if (typeof route === "undefined") {
      return;
    }
    return route(ctx, args);
  }
}
