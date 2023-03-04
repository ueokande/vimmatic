import { injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ZoomHelper from "./ZoomHelper";

@injectable()
export default class ZoomInOperator implements Operator {
  private readonly zoomHelper = new ZoomHelper();

  name() {
    return "zoom.in";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.zoomHelper.zoomIn(sender.tabId);
  }
}
