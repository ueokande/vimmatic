import * as messages from "../../shared/messages";

export default class SettingClient {
  async getColorScheme(): Promise<string> {
    const value = await browser.runtime.sendMessage({
      type: messages.SETTINGS_GET_PROPERTY,
      name: "colorscheme",
    });
    return value as string;
  }
}
