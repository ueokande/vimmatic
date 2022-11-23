import { Operation } from "./operations2";

export default class Keymaps {
  constructor(private readonly data: { [key: string]: Operation }) {}

  combine(other: Keymaps): Keymaps {
    return new Keymaps({
      ...this.data,
      ...other.data,
    });
  }

  entries(): [string, Operation][] {
    return Object.entries(this.data);
  }
}
