import { inject, injectable } from "inversify";
import { OperatorRegistry } from "../../operators/OperatorRegistry";
import { RepeatRepository } from "../../repositories/RepeatRepository";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class RepeatLastOperator implements Operator {
  constructor(
    @inject(OperatorRegistry)
    private readonly operatorRegistry: OperatorRegistry,
    @inject(RepeatRepository)
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
    const op = this.operatorRegistry.getOperator(lastOp.type);
    if (typeof op === "undefined") {
      throw new Error(`unknown operation: ${lastOp.type}`);
    }
    return op.run(ctx, lastOp.props);
  }
}
