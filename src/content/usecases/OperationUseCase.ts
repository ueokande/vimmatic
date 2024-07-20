import { injectable, inject } from "inversify";
import type { OperationClient } from "../client/OperationClient";
import type { Operation } from "../../shared/operation";

@injectable()
export class OperationUseCase {
  constructor(
    @inject("OperationClient")
    private readonly operationClient: OperationClient,
  ) {}

  async exec(op: Operation, repeat: number): Promise<void> {
    await this.operationClient.execBackgroundOp(op, repeat);
  }
}
