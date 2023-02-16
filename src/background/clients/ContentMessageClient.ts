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

  async scrollVertically(
    tabId: number,
    amount: number,
    smooth: boolean
  ): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("scroll.vertically", { amount, smooth });
  }

  async scrollHorizonally(
    tabId: number,
    amount: number,
    smooth: boolean
  ): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("scroll.horizonally", { amount, smooth });
  }

  async scrollPages(
    tabId: number,
    amount: number,
    smooth: boolean
  ): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("scroll.pages", { amount, smooth });
  }

  async scrollToBottom(tabId: number, smooth: boolean): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("scroll.bottom", { smooth });
  }

  async scrollToEnd(tabId: number, smooth: boolean): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("scroll.end", { smooth });
  }

  async scrollToHome(tabId: number, smooth: boolean): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("scroll.home", { smooth });
  }

  async scrollToTop(tabId: number, smooth: boolean): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("scroll.top", { smooth });
  }
}
