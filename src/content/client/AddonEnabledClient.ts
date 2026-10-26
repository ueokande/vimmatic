import { provide } from "@inversifyjs/binding-decorators";
import { inject } from "inversify";
import { BackgroundMessageSender } from "./BackgroundMessageSender";

export interface AddonEnabledClient {
  isEnabled(): Promise<boolean>;
}

export const AddonEnabledClient = Symbol("AddonEnabledClient");

@provide(AddonEnabledClient)
export class AddonEnabledClientImpl implements AddonEnabledClient {
  constructor(
    @inject(BackgroundMessageSender)
    private readonly sender: BackgroundMessageSender,
  ) {}

  async isEnabled(): Promise<boolean> {
    const { enabled } = await this.sender.send("addon.enabled");
    return enabled;
  }
}
