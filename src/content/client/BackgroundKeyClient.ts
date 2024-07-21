import { injectable, inject } from "inversify";
import type { Key } from "../../shared/key";
import { BackgroundMessageSender } from "./BackgroundMessageSender";

export interface BackgroundKeyClient {
  sendKey(key: Key): Promise<void>;
}

export const BackgroundKeyClient = Symbol("BackgroundKeyClient");

@injectable()
export class BackgroundKeyClientImpl implements BackgroundKeyClient {
  constructor(
    @inject(BackgroundMessageSender)
    private readonly sender: BackgroundMessageSender,
  ) {}

  async sendKey(key: Key): Promise<void> {
    await this.sender.send("press.key", { key: key.key });
  }
}
