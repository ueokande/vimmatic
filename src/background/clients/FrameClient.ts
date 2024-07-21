import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

export interface FrameClient {
  notifyFrameId(tabId: number, frameId: number): Promise<void>;
}

export const FrameClient = Symbol("FrameClient");

@injectable()
export class FrameClientImpl implements FrameClient {
  async notifyFrameId(tabId: number, frameId: number): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("notify.frame.id", { frameId });
  }
}
