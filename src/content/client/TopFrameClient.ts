import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { WindowMessageSender } from "./WindowMessageSender";

export interface TopFrameClient {
  notifyFrameId(frameId: number): Promise<void>;
}

export const TopFrameClient = Symbol("TopFrameClient");

@provide(TopFrameClient)
export class TopFrameClientImpl implements TopFrameClient {
  constructor(
    @inject(WindowMessageSender)
    private readonly sender: WindowMessageSender,
  ) {}

  async notifyFrameId(frameId: number): Promise<void> {
    this.sender.send("notify.frame.id", { frameId });
  }
}
