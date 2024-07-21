import { provide } from "inversify-binding-decorators";
import { newSender } from "./ContentMessageSender";

export interface ContentMessageClient {
  scrollTo(
    tabId: number,
    frameId: number,
    x: number,
    y: number,
    smooth: boolean,
  ): Promise<void>;
  getScroll(tabId: number, frameId: number): Promise<{ x: number; y: number }>;
  settingsChanged(tabId: number): Promise<void>;
  scrollVertically(
    tabId: number,
    frameId: number,
    amount: number,
    smooth: boolean,
  ): Promise<void>;
  scrollHorizonally(
    tabId: number,
    frameId: number,
    amount: number,
    smooth: boolean,
  ): Promise<void>;
  scrollPages(
    tabId: number,
    frameId: number,
    amount: number,
    smooth: boolean,
  ): Promise<void>;
  scrollToBottom(
    tabId: number,
    frameId: number,
    smooth: boolean,
  ): Promise<void>;
  scrollToEnd(tabId: number, frameId: number, smooth: boolean): Promise<void>;
  scrollToHome(tabId: number, frameId: number, smooth: boolean): Promise<void>;
  scrollToTop(tabId: number, frameId: number, smooth: boolean): Promise<void>;
  focusFirstInput(tabId: number): Promise<void>;
}

export const ContentMessageClient = Symbol("ContentMessageClient");

@provide(ContentMessageClient)
export class ContentMessageClientImpl implements ContentMessageClient {
  async scrollTo(
    tabId: number,
    frameId: number,
    x: number,
    y: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.to", { x, y, smooth });
  }

  async getScroll(
    tabId: number,
    frameId: number,
  ): Promise<{ x: number; y: number }> {
    const sender = newSender(tabId, frameId);
    return sender.send("get.scroll");
  }

  async settingsChanged(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("settings.changed");
  }

  async scrollVertically(
    tabId: number,
    frameId: number,
    amount: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.vertically", { amount, smooth });
  }

  async scrollHorizonally(
    tabId: number,
    frameId: number,
    amount: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.horizonally", { amount, smooth });
  }

  async scrollPages(
    tabId: number,
    frameId: number,
    amount: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.pages", { amount, smooth });
  }

  async scrollToBottom(
    tabId: number,
    frameId: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.bottom", { smooth });
  }

  async scrollToEnd(
    tabId: number,
    frameId: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.end", { smooth });
  }

  async scrollToHome(
    tabId: number,
    frameId: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.home", { smooth });
  }

  async scrollToTop(
    tabId: number,
    frameId: number,
    smooth: boolean,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("scroll.top", { smooth });
  }

  async focusFirstInput(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("focus.input");
  }
}
