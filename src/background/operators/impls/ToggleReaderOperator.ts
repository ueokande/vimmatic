import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class ToggleReaderOperator implements Operator {
  name() {
    return "tabs.reader.toggle";
  }

  schema() {}

  async run(): Promise<void> {
    await chrome.tabs.toggleReaderMode();
  }
}
