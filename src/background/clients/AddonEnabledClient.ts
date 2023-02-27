import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

export default interface AddonEnabledClient {
  enable(tabId: number): Promise<void>;

  disable(tabId: number): Promise<void>;
}

@injectable()
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
