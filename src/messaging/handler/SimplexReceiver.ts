import { Simplex } from "../types";

type SimplexHandler<
  Schema extends { [Key in keyof Schema]: Simplex<unknown> }
> = (args: Schema[keyof Schema]["Request"]) => void;

type SimplexSingleHandler<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Simplex<unknown> }
> = (args: Schema[Key]["Request"]) => void;

export class SimplexRouter<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Simplex<unknown> }
> {
  constructor(
    private readonly type: Key,
    private readonly routes: Map<keyof Schema, SimplexHandler<Schema>>
  ) {}

  to(handler: SimplexSingleHandler<Key, Schema>) {
    this.routes.set(this.type, handler);
  }
}

export default class SimplexReceiver<
  Schema extends { [Key in keyof Schema]: Simplex<unknown> }
> {
  private readonly routes: Map<keyof Schema, SimplexHandler<Schema>> =
    new Map();

  route<Key extends keyof Schema>(type: Key): SimplexRouter<Key, Schema> {
    if (this.routes.has(type)) {
      throw new Error(`The route on "${String(type)}" is already exists`);
    }
    return new SimplexRouter<Key, Schema>(type, this.routes);
  }

  receive(type: unknown, args: unknown): void {
    const route = this.routes.get(type as keyof Schema);
    if (typeof route === "undefined") {
      return;
    }
    route(args);
  }
}
