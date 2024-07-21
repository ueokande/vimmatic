import { provide } from "inversify-binding-decorators";
import { newSender } from "./ContentMessageSender";

export interface AddonEnabledClient {
  enable(tabId: number): Promise<void>;

  disable(tabId: number): Promise<void>;
}

export const AddonEnabledClient = Symbol("AddonEnabledClient");

@provide(AddonEnabledClient)
export class AddonEnabledClientImpl implements AddonEnabledClient {
  async enable(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("addon.enable");
  }

  async disable(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("addon.disable");
  }
}
