import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class ResetZoomOperator implements Operator {
  name() {
    return "zoom.neutral";
  }

  schema() {}

  async run(): Promise<void> {
    return browser.tabs.setZoom(1);
  }
}