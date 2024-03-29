import { injectable, inject } from "inversify";
import type { Operation } from "../../shared/operation";
import type { BackgroundMessageSender } from "./BackgroundMessageSender";

export interface OperationClient {
  execBackgroundOp(op: Operation, repeat: number): Promise<void>;
}

@injectable()
export class OperationClientImpl implements OperationClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender,
  ) {}

  async execBackgroundOp(op: Operation, repeat: number): Promise<void> {
    await this.sender.send("background.operation", { op, repeat });
  }
}
