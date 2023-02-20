import { injectable, inject } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";
import MarkModeUseCase from "../../usecases/MarkModeUseCase";

@injectable()
export default class StartSetMarkOperator implements Operator {
  constructor(
    @inject(MarkModeUseCase)
    private markModeUseCase: MarkModeUseCase
  ) {}

  name() {
    return "mark.set.prefix";
  }

  schema() {}

  run(ctx: RequestContext): Promise<void> {
    return this.markModeUseCase.enableMarkSetMode(ctx);
  }
}
