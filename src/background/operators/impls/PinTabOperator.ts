import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class PinTabOperator implements Operator {
  name(): string {
    return "tabs.pin";
  }

  schema() {}

  async run(): Promise<void> {
    await browser.tabs.update({ pinned: true });
  }
}
