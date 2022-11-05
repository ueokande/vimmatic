import { injectable } from "inversify";
import * as messages from "../../shared/messages";

@injectable()
export default class ContentMessageClient {
  async getAddonEnabled(tabId: number): Promise<boolean> {
    const enabled = await browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_ENABLED_QUERY,
    });
    return enabled as any as boolean;
  }

  async toggleAddonEnabled(tabId: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_TOGGLE_ENABLED,
    });
  }

  async scrollTo(tabId: number, x: number, y: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.TAB_SCROLL_TO,
      x,
      y,
    });
  }

  async settingsChanged(tabId: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.SETTINGS_CHANGED,
    });
  }
}
