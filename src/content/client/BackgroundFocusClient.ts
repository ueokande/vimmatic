import { provide } from "@inversifyjs/binding-decorators";
import { inject } from "inversify";
import { BackgroundMessageSender } from "./BackgroundMessageSender";

export interface BackgroundFocusClient {
  notifyFocusChanged(focused: boolean): Promise<void>;
}

export const BackgroundFocusClient = Symbol("BackgroundFocusClient");

@provide(BackgroundFocusClient)
export class BackgroundFocusClientImpl implements BackgroundFocusClient {
  constructor(
    @inject(BackgroundMessageSender)
    private readonly sender: BackgroundMessageSender,
  ) {}

  async notifyFocusChanged(focused: boolean): Promise<void> {
    await this.sender.send("focus.state.changed", { focused });
  }
}
