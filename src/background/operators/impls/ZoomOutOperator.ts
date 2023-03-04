import { injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ZoomHelper from "./ZoomHelper";

@injectable()
export default class ZoomOutOperator implements Operator {
  private readonly zoomHelper = new ZoomHelper();

  name() {
    return "zoom.out";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.zoomHelper.zoomOut(sender.tabId);
  }
}
