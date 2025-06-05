import { provide } from "inversify-binding-decorators";
import { newSender } from "./ContentMessageSender";

export interface VisualClient {
  moveLeft(tabId: number, frameId: number, amount: number): Promise<void>;

  moveRight(tabId: number, frameId: number, amount: number): Promise<void>;

  moveEndWord(tabId: number, frameId: number, amount: number): Promise<void>;

  moveNextWord(tabId: number, frameId: number, amount: number): Promise<void>;

  movePrevWord(tabId: number, frameId: number, amount: number): Promise<void>;
}

export const VisualClient = Symbol("VisualClient");

@provide(VisualClient)
export class VisualClientImpl implements VisualClient {
  async moveLeft(
    tabId: number,
    frameId: number,
    amount: number,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("visual.left", { amount });
  }
  async moveRight(
    tabId: number,
    frameId: number,
    amount: number,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("visual.right", { amount });
  }

  async moveEndWord(
    tabId: number,
    frameId: number,
    amount: number,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("visual.word.end", { amount });
  }
  async moveNextWord(
    tabId: number,
    frameId: number,
    amount: number,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("visual.word.next", { amount });
  }

  async movePrevWord(
    tabId: number,
    frameId: number,
    amount: number,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("visual.word.back", { amount });
  }
}
