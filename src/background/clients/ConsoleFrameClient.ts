import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

export interface ConsoleFrameClient {
  resize(tabId: number, width: number, height: number): Promise<void>;
}

export const ConsoleFrameClient = Symbol("ConsoleFrameClient");

@injectable()
export class ConsoleFrameClientImpl implements ConsoleFrameClient {
  async resize(tabId: number, width: number, height: number): Promise<void> {
    const sender = newSender(tabId);
    sender.send("console.resize", { width, height });
  }
}
