import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import type { Operation } from "../../shared/operation";
import { BackgroundMessageSender } from "./BackgroundMessageSender";

export interface OperationClient {
  execBackgroundOp(op: Operation, repeat: number): Promise<void>;
}

export const OperationClient = Symbol("OperationClient");

@provide(OperationClient)
export class OperationClientImpl implements OperationClient {
  constructor(
    @inject(BackgroundMessageSender)
    private readonly sender: BackgroundMessageSender,
  ) {}

  async execBackgroundOp(op: Operation, repeat: number): Promise<void> {
    await this.sender.send("background.operation", { op, repeat });
  }
}
