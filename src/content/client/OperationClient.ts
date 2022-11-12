import { injectable, inject } from "inversify";
import * as operations from "../../shared/operations";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface OperationClient {
  execBackgroundOp(repeat: number, op: operations.Operation): Promise<void>;

  internalOpenUrl(
    url: string,
    newTab?: boolean,
    background?: boolean
  ): Promise<void>;
}

@injectable()
export class OperationClientImpl implements OperationClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async execBackgroundOp(
    repeat: number,
    operation: operations.Operation
  ): Promise<void> {
    await this.sender.send("background.operation", { repeat, operation });
  }

  async internalOpenUrl(
    url: string,
    newTab?: boolean,
    background?: boolean
  ): Promise<void> {
    await this.sender.send("background.operation", {
      repeat: 1,
      operation: {
        type: "internal.open.url",
        url,
        newTab,
        background,
      },
    });
  }
}
