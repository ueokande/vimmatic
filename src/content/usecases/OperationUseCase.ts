import { inject, injectable } from "inversify";
import type { Operation } from "../../shared/operation";
import { OperationClient } from "../client/OperationClient";

@injectable()
export class OperationUseCase {
  constructor(
    @inject(OperationClient)
    private readonly operationClient: OperationClient,
  ) {}

  async exec(op: Operation, repeat: number): Promise<void> {
    await this.operationClient.execBackgroundOp(op, repeat);
  }
}
