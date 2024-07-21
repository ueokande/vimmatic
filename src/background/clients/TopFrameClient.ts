import { provide } from "inversify-binding-decorators";
import { newSender } from "./ContentMessageSender";

export type Rect = {
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export interface TopFrameClient {
  getWindowViewport(tabId: number): Promise<Rect>;

  getFramePosition(tabId: number, frameId: number): Promise<Point | undefined>;
}

export const TopFrameClient = Symbol("TopFrameClient");

@provide(TopFrameClient)
export class TopFrameClientImpl implements TopFrameClient {
  getWindowViewport(tabId: number): Promise<Rect> {
    const sender = newSender(tabId, 0);
    return sender.send("get.window.viewport");
  }

  getFramePosition(tabId: number, frameId: number): Promise<Point | undefined> {
    const sender = newSender(tabId, 0);
    return sender.send("get.frame.position", { frameId });
  }
}
