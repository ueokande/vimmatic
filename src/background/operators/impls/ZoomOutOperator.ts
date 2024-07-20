import { injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import { ZoomHelper } from "./ZoomHelper";

@injectable()
export class ZoomOutOperator implements Operator {
  private readonly zoomHelper = new ZoomHelper();

  name() {
    return "zoom.out";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.zoomHelper.zoomOut(sender.tabId);
  }
}
