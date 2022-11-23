import { injectable } from "inversify";
import Operator from "../Operator";
import ZoomHelper from "./ZoomHelper";

@injectable()
export default class ZoomInOperator implements Operator {
  private readonly zoomHelper = new ZoomHelper();

  name() {
    return "zoom.in";
  }

  schema() {}

  run(): Promise<void> {
    return this.zoomHelper.zoomIn();
  }
}
