import { injectable } from "inversify";
import type { Operator } from "../types";

@injectable()
export class ZoomResetOperator implements Operator {
  name() {
    return "zoom.neutral";
  }

  schema() {}

  async run(): Promise<void> {
    return chrome.tabs.setZoom(0);
  }
}
