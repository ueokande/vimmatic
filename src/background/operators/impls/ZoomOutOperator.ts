import { injectable } from "inversify";
import Operator from "../Operator";
import ZoomHelper from "./ZoomHelper";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ZoomOutOperator implements Operator {
  private readonly zoomHelper = new ZoomHelper();

  name() {
    return "zoom.out";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    await this.zoomHelper.zoomOut(sender.tabId);
  }
}
