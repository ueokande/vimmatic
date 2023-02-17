import { injectable, inject } from "inversify";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface OperationClient {
  execBackgroundOp(
    name: string,
    props: Record<string, string | number | boolean>,
    repeat: number
  ): Promise<void>;
}

@injectable()
export class OperationClientImpl implements OperationClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async execBackgroundOp(
    name: string,
    props: Record<string, string | number | boolean>,
    repeat: number
  ): Promise<void> {
    await this.sender.send("background.operation", { name, props, repeat });
  }
}
