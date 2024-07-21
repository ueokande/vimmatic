import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";
import type { HTMLElementType } from "../../shared/HTMLElementType";

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export interface HintClient {
  lookupTargets(
    tabId: number,
    frameId: number,
    cssSelector: string,
    viewSize: Size,
    framePosition: Point,
  ): Promise<string[]>;

  assignTags(
    tabId: number,
    frameId: number,
    elementTags: Record<string, string>,
  ): Promise<void>;

  showHints(tabId: number, frameId: number, elements: string[]): Promise<void>;

  clearHints(tabId: number): Promise<void>;

  getElement(
    tabId: number,
    frameId: number,
    element: string,
  ): Promise<HTMLElementType | undefined>;

  focusElement(tabId: number, frameId: number, element: string): Promise<void>;

  clickElement(tabId: number, frameId: number, element: string): Promise<void>;
}

export const HintClient = Symbol("HintClient");

@injectable()
export class HintClientImpl implements HintClient {
  async lookupTargets(
    tabId: number,
    frameId: number,
    cssSelector: string,
    viewSize: Size,
    framePosition: Point,
  ): Promise<string[]> {
    const sender = newSender(tabId, frameId);
    const { elements } = await sender.send("hint.lookup", {
      viewSize,
      framePosition,
      cssSelector,
    });
    return elements;
  }

  assignTags(
    tabId: number,
    frameId: number,
    elementTags: Record<string, string>,
  ): Promise<void> {
    const sender = newSender(tabId, frameId);
    return sender.send("hint.assign", { elementTags });
  }

  showHints(tabId: number, frameId: number, elements: string[]): Promise<void> {
    const sender = newSender(tabId, frameId);
    return sender.send("hint.show", { elements });
  }

  clearHints(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    return sender.send("hint.clear");
  }

  getElement(
    tabId: number,
    frameId: number,
    element: string,
  ): Promise<HTMLElementType | undefined> {
    const sender = newSender(tabId, frameId);
    return sender.send("hint.getElement", { element });
  }

  focusElement(tabId: number, frameId: number, element: string): Promise<void> {
    const sender = newSender(tabId, frameId);
    return sender.send("hint.focus", { element });
  }

  clickElement(tabId: number, frameId: number, element: string): Promise<void> {
    const sender = newSender(tabId, frameId);
    return sender.send("hint.click", { element });
  }
}
