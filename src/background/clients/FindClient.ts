import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";
import type { FindQuery } from "../../shared/findQuery";

export interface FindClient {
  findNext(tabId: number, frameId: number, query: FindQuery): Promise<boolean>;

  findPrev(tabId: number, frameId: number, query: FindQuery): Promise<boolean>;

  clearSelection(tabId: number, frameId: number): Promise<void>;
}

@injectable()
export class FindClientImpl implements FindClient {
  async findNext(
    tabId: number,
    frameId: number,
    query: FindQuery,
  ): Promise<boolean> {
    const sender = newSender(tabId, frameId);
    const found = await sender.send("find.next", query);
    return found;
  }

  async findPrev(
    tabId: number,
    frameId: number,
    query: FindQuery,
  ): Promise<boolean> {
    const sender = newSender(tabId, frameId);
    const found = await sender.send("find.prev", query);
    return found;
  }

  async clearSelection(tabId: number, frameId: number): Promise<void> {
    const sender = newSender(tabId, frameId);
    await sender.send("find.clear.selection");
  }
}
