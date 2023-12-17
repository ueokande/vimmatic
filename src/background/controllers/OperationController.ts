import { inject, injectable } from "inversify";
import type Operation from "../../shared/Operation";
import OperationUseCase from "../usecases/OperationUseCase";
import RequestContext from "../messaging/RequestContext";

@injectable()
export default class OperationController {
  constructor(
    @inject(OperationUseCase)
    private readonly operationUseCase: OperationUseCase,
  ) {}

  async exec(
    ctx: RequestContext,
    {
      repeat,
      op,
    }: {
      repeat: number;
      op: Operation;
    },
  ): Promise<void> {
    await this.operationUseCase.run(ctx, op, repeat);
  }
}
