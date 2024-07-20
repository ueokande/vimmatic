import type { Duplex } from "../types";

type Handler<
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
> = (
  args: Schema[keyof Schema]["Request"],
) => Promise<Schema[keyof Schema]["Response"]> | void;

type SingleHandler<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
> = (args: Schema[Key]["Request"]) => Promise<Schema[Key]["Response"]> | void;

export class Router<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
> {
  constructor(
    private readonly type: Key,
    private readonly routes: Map<keyof Schema, Handler<Schema>>,
  ) {}

  to(handler: SingleHandler<Key, Schema>) {
    this.routes.set(this.type, handler);
  }
}

export class Receiver<
  Schema extends { [Key in keyof Schema]: Duplex<unknown, unknown> },
> {
  private readonly routes: Map<keyof Schema, Handler<Schema>> = new Map();

  route<Key extends keyof Schema>(type: Key): Router<Key, Schema> {
    if (this.routes.has(type)) {
      throw new Error(`The route on "${String(type)}" is already exists`);
    }
    return new Router<Key, Schema>(type, this.routes);
  }

  receive(type: unknown, args: unknown): Schema[keyof Schema]["Response"] {
    const route = this.routes.get(type as keyof Schema);
    if (typeof route === "undefined") {
      return;
    }
    return route(args);
  }
}
