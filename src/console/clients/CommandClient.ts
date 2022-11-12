import type BackgroundMessageSender from "./BackgroundMessageSender";

export default class CommandClient {
  constructor(private readonly sender: BackgroundMessageSender) {}

  async execCommand(text: string): Promise<void> {
    this.sender.send("console.enter.command", { text });
  }

  async execFind(text?: string): Promise<void> {
    this.sender.send("console.enter.find", { keyword: text });
  }
}
