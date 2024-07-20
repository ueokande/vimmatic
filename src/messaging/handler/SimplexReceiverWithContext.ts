import type { Simplex } from "../types";

type SimplexHandlerWithContext<
  Schema extends { [Key in keyof Schema]: Simplex<unknown> },
  Context,
> = (ctx: Context, args: Schema[keyof Schema]["Request"]) => void;

type SimplexSingleHandlerWithContext<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Simplex<unknown> },
  Context,
> = (ctx: Context, args: Schema[Key]["Request"]) => void;

export class SimplexRouterWithContext<
  Key extends keyof Schema,
  Schema extends { [Key in keyof Schema]: Simplex<unknown> },
  Context,
> {
  constructor(
    private readonly type: Key,
    private readonly routes: Map<
      keyof Schema,
      SimplexHandlerWithContext<Schema, Context>
    >,
  ) {}

  to(handler: SimplexSingleHandlerWithContext<Key, Schema, Context>) {
    this.routes.set(this.type, handler);
  }
}

export class SimplexReceiverWithContext<
  Schema extends { [Key in keyof Schema]: Simplex<unknown> },
  Context,
> {
  private readonly routes: Map<
    keyof Schema,
    SimplexHandlerWithContext<Schema, Context>
  > = new Map();

  route<Key extends keyof Schema>(
    type: Key,
  ): SimplexRouterWithContext<Key, Schema, Context> {
    if (this.routes.has(type)) {
      throw new Error(`The route on "${String(type)}" is already exists`);
    }
    return new SimplexRouterWithContext<Key, Schema, Context>(
      type,
      this.routes,
    );
  }

  receive(ctx: Context, type: unknown, args: unknown): void {
    const route = this.routes.get(type as keyof Schema);
    if (typeof route === "undefined") {
      return;
    }
    route(ctx, args);
  }
}
