import { provide } from "inversify-binding-decorators";
import { newSender } from "./ContentMessageSender";

export interface NavigateClient {
  historyNext(tabId: number): Promise<void>;

  historyPrev(tabId: number): Promise<void>;

  linkNext(tabId: number): Promise<void>;

  linkPrev(tabId: number): Promise<void>;
}

export const NavigateClient = Symbol("NavigateClient");

@provide(NavigateClient)
export class NavigateClientImpl implements NavigateClient {
  async historyNext(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("navigate.history.next");
  }

  async historyPrev(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("navigate.history.prev");
  }

  async linkNext(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("navigate.link.next");
  }

  async linkPrev(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("navigate.link.prev");
  }
}
