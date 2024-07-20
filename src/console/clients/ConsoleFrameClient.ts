import type { BackgroundMessageSender } from "./BackgroundMessageSender";

export class ConsoleFrameClient {
  constructor(private readonly sender: BackgroundMessageSender) {}

  async resize(width: number, height: number): Promise<void> {
    this.sender.send("console.resize", { width, height });
  }
}
