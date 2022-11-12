import { injectable, inject } from "inversify";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface AddonIndicatorClient {
  setEnabled(enabled: boolean): Promise<void>;
}

@injectable()
export class AddonIndicatorClientImpl implements AddonIndicatorClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async setEnabled(enabled: boolean): Promise<void> {
    await this.sender.send("addon.enabled.response", { enabled });
  }
}
