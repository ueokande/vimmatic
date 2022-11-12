import { injectable, inject } from "inversify";
import { deserialize } from "../../settings";
import type Settings from "../../shared/Settings";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface SettingClient {
  load(): Promise<Settings>;
}

@injectable()
export class SettingClientImpl {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async load(): Promise<Settings> {
    const payload = await this.sender.send("settings.query");
    return deserialize(payload);
  }
}
