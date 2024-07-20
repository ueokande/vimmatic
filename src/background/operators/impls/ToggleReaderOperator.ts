import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export class ToggleReaderOperator implements Operator {
  name() {
    return "tabs.reader.toggle";
  }

  schema() {}

  async run(): Promise<void> {
    await chrome.tabs.toggleReaderMode();
  }
}
