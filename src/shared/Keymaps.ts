import Operation from "./Operation";

export type OperationSetting = { type: string } & Record<
  string,
  string | number | boolean
>;

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
