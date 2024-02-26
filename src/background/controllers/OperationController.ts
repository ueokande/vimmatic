import { inject, injectable } from "inversify";
import type { Operation } from "../../shared/operation";
import type { RequestContext } from "../messaging/types";
import OperationUseCase from "../usecases/OperationUseCase";

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
