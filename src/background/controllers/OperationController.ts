import { inject, injectable } from "inversify";
import * as operations from "../../shared/operations";
import OperatorFactory from "../operators/OperatorFactory";
import RepeatUseCase from "../usecases/RepeatUseCase";
import RequestContext from "./RequestContext";

@injectable()
export default class OperationController {
  constructor(
    @inject(RepeatUseCase)
    private readonly repeatUseCase: RepeatUseCase,
    @inject("OperatorFactory")
    private readonly operatorFactory: OperatorFactory
  ) {}

  async exec(
    _ctx: RequestContext,
    {
      repeat,
      operation,
    }: {
      repeat: number;
      operation: operations.Operation;
    }
  ): Promise<void> {
    await this.doOperation(repeat, operation);
    if (this.repeatUseCase.isRepeatable(operation)) {
      this.repeatUseCase.storeLastOperation(operation);
    }
  }

  private async doOperation(
    repeat: number,
    operation: operations.Operation
  ): Promise<void> {
    const operator = this.operatorFactory.create(operation);
    for (let i = 0; i < repeat; ++i) {
      // eslint-disable-next-line no-await-in-loop
      await operator.run();
    }
  }
}
