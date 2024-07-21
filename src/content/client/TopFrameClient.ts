import { injectable, inject } from "inversify";
import { WindowMessageSender } from "./WindowMessageSender";

export interface TopFrameClient {
  notifyFrameId(frameId: number): Promise<void>;
}

export const TopFrameClient = Symbol("TopFrameClient");

@injectable()
export class TopFrameClientImpl implements TopFrameClient {
  constructor(
    @inject(WindowMessageSender)
    private readonly sender: WindowMessageSender,
  ) {}

  async notifyFrameId(frameId: number): Promise<void> {
    this.sender.send("notify.frame.id", { frameId });
  }
}
