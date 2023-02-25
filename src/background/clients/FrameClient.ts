import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

export default interface FrameClient {
  notifyFrameId(tabId: number, frameId: number): Promise<void>;
}

@injectable()
export class FrameClientImpl implements FrameClient {
  async notifyFrameId(tabId: number, frameId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("notify.frame.id", { frameId });
  }
}
