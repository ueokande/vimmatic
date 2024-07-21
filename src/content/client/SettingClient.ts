import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { deserialize } from "../../settings";
import type { Settings } from "../../shared/settings";
import { BackgroundMessageSender } from "./BackgroundMessageSender";

export interface SettingClient {
  load(): Promise<Settings>;
}

export const SettingClient = Symbol("SettingClient");

@provide(SettingClient)
export class SettingClientImpl {
  constructor(
    @inject(BackgroundMessageSender)
    private readonly sender: BackgroundMessageSender,
  ) {}

  async load(): Promise<Settings> {
    const payload = await this.sender.send("settings.query");
    return deserialize(payload);
  }
}
