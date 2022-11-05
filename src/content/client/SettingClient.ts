import { injectable } from "inversify";
import { deserialize } from "../../settings";
import * as messages from "../../shared/messages";
import type Settings from "../../shared/Settings";

export default interface SettingClient {
  load(): Promise<Settings>;
}

@injectable()
export class SettingClientImpl {
  async load(): Promise<Settings> {
    const payload = await browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    });
    return deserialize(payload);
  }
}
