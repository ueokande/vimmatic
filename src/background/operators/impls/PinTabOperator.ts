import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export class PinTabOperator implements Operator {
  name(): string {
    return "tabs.pin";
  }

  schema() {}

  async run(): Promise<void> {
    await chrome.tabs.update({ pinned: true });
  }
}
