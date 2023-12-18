import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export default interface HintClient {
  countHints(
    tabId: number,
    frameId: number,
    viewSize: Size,
    framePosition: Point,
  ): Promise<number>;

  createHints(
    tabId: number,
    frameId: number,
    hints: string[],
    viewSize: Size,
    framePosition: Point,
  ): Promise<void>;

  filterHints(tabId: number, prefix: string): Promise<void>;

  clearHints(tabId: number): Promise<void>;

  activateIfExists(
    tabId: number,
    tag: string,
    newTab: boolean,
    background: boolean,
  ): Promise<void>;
}

@injectable()
export class HintClientImpl implements HintClient {
  countHints(
    tabId: number,
    frameId: number,
    viewSize: Size,
    framePosition: Point,
  ): Promise<number> {
    const sender = newSender(tabId, frameId);
    return sender.send("follow.count.hints", {
      viewSize,
      framePosition,
    });
  }

  createHints(
    tabId: number,
    frameId: number,
    hints: string[],
    viewSize: Size,
    framePosition: Point,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    return sender.send("follow.create.hints", {
      viewSize,
      framePosition,
      hints,
    });
  }

  filterHints(tabId: number, prefix: string): Promise<void> {
    const sender = newSender(tabId);
    return sender.send("follow.filter.hints", { prefix });
  }

  clearHints(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    return sender.send("follow.remove.hints");
  }

  activateIfExists(
    tabId: number,
    hint: string,
    newTab: boolean,
    background: boolean,
  ): Promise<void> {
    const sender = newSender(tabId);
    return sender.send("follow.activate", { hint, newTab, background });
  }
}
