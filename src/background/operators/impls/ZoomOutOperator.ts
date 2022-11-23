import { injectable } from "inversify";
import Operator from "../Operator";
import ZoomHelper from "./ZoomHelper";

@injectable()
export default class ZoomOutOperator implements Operator {
  private readonly zoomHelper = new ZoomHelper();

  name() {
    return "zoom.out";
  }

  schema() {}

  run(): Promise<void> {
    return this.zoomHelper.zoomOut();
  }
}
