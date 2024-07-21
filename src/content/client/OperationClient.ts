import { injectable, inject } from "inversify";
import type { Operation } from "../../shared/operation";
import { BackgroundMessageSender } from "./BackgroundMessageSender";

export interface OperationClient {
  execBackgroundOp(op: Operation, repeat: number): Promise<void>;
}

export const OperationClient = Symbol("OperationClient");

@injectable()
export class OperationClientImpl implements OperationClient {
  constructor(
    @inject(BackgroundMessageSender)
    private readonly sender: BackgroundMessageSender,
  ) {}

  async execBackgroundOp(op: Operation, repeat: number): Promise<void> {
    await this.sender.send("background.operation", { op, repeat });
  }
}
