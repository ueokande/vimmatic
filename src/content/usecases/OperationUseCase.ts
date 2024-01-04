import { injectable, inject } from "inversify";
import OperationClient from "../client/OperationClient";
import type Operation from "../../shared/Operation";

@injectable()
export default class OperationUseCase {
  constructor(
    @inject("OperationClient")
    private readonly operationClient: OperationClient,
  ) {}

  async exec(op: Operation, repeat: number): Promise<void> {
    await this.operationClient.execBackgroundOp(op, repeat);
  }
}
