import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

export default interface FindClient {
  findNext(tabId: number, frameId: number, keyword: string): Promise<boolean>;

  findPrev(tabId: number, frameId: number, keyword: string): Promise<boolean>;

  clearSelection(tabId: number, frameId: number): Promise<void>;
}

@injectable()
export class FindClientImpl implements FindClient {
  async findNext(
    tabId: number,
    frameId: number,
    keyword: string,
  ): Promise<boolean> {
    const sender = newSender(tabId, frameId);
    const found = await sender.send("find.next", { keyword });
    return found;
  }

  async findPrev(
    tabId: number,
    frameId: number,
    keyword: string,
  ): Promise<boolean> {
    const sender = newSender(tabId, frameId);
    const found = await sender.send("find.prev", { keyword });
    return found;
  }

  async clearSelection(tabId: number, frameId: number): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("find.clear.selection");
  }
}
