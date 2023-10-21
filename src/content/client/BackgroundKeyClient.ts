import { injectable, inject } from "inversify";
import Key from "../../shared/Key";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface BackgroundKeyClient {
  sendKey(key: Key): Promise<void>;
}

@injectable()
export class BackgroundKeyClientImpl implements BackgroundKeyClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender,
  ) {}

  async sendKey(key: Key): Promise<void> {
    await this.sender.send("press.key", { key: key.key });
  }
}
