import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

@injectable()
export default class ContentMessageClient {
  async getAddonEnabled(tabId: number): Promise<boolean> {
    const sender = newSender(tabId);
    const enabled = await sender.send("addon.enabled.query");
    return enabled;
  }

  async toggleAddonEnabled(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("addon.toggle.enabled");
  }

  async scrollTo(tabId: number, x: number, y: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("tab.scroll.to", { x, y });
  }

  async settingsChanged(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("settings.changed");
  }
}
