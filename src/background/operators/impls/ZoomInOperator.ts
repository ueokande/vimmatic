import { injectable } from "inversify";
import Operator from "../Operator";
import ZoomHelper from "./ZoomHelper";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ZoomInOperator implements Operator {
  private readonly zoomHelper = new ZoomHelper();

  name() {
    return "zoom.in";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    if (!sender?.tab?.id) {
      return;
    }
    await this.zoomHelper.zoomIn(sender.tab.id);
  }
}
