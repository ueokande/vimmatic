import type BackgroundMessageSender from "./BackgroundMessageSender";

export default class SettingClient {
  constructor(private readonly sender: BackgroundMessageSender) {}

  async getColorScheme(): Promise<string> {
    const value = await this.sender.send("settings.get.property", {
      name: "colorscheme",
    });
    return value as string;
  }

  async getConsoleStyle(): Promise<Record<string, string>> {
    const value = await this.sender.send("settings.get.style", {
      name: "console",
    });
    return value as Record<string, string>;
  }
}
