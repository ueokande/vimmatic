import { injectable, inject } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import RepeatRepository from "../../repositories/RepeatRepository";
import OperatorRegistory from "../../operators/OperatorRegistory";

@injectable()
export default class RepeatLastOperator implements Operator {
  constructor(
    @inject("OperatorRegistory")
    private readonly operatorRegistory: OperatorRegistory,
    @inject("RepeatRepository")
    private readonly repeatRepository: RepeatRepository,
  ) {}

  name() {
    return "repeat";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    const lastOp = await this.repeatRepository.getLastOperation();
    if (lastOp === null) {
      return Promise.resolve();
    }
    const op = this.operatorRegistory.getOperator(lastOp.type);
    if (typeof op === "undefined") {
      throw new Error("unknown operation: " + lastOp.type);
    }
    return op.run(ctx, lastOp.props);
  }
}
