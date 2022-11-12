import { injectable, inject } from "inversify";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface ConsoleClient {
  info(text: string): Promise<void>;
  error(text: string): Promise<void>;
}

@injectable()
export class ConsoleClientImpl implements ConsoleClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async info(text: string): Promise<void> {
    this.sender.send("console.frame.message", {
      message: {
        type: "console.show.info",
        text,
      },
    });
  }

  async error(text: string): Promise<void> {
    this.sender.send("console.frame.message", {
      message: {
        type: "console.show.error",
        text,
      },
    });
  }
}
