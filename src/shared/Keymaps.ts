import * as operations from "./operations";

export default class Keymaps {
  constructor(private readonly data: { [key: string]: operations.Operation }) {}

  combine(other: Keymaps): Keymaps {
    return new Keymaps({
      ...this.data,
      ...other.data,
    });
  }

  entries(): [string, operations.Operation][] {
    return Object.entries(this.data);
  }
}
