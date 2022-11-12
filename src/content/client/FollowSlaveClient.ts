import { injectable, inject } from "inversify";
import type WindowMessageSender from "./WindowMessageSender";

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export default interface FollowSlaveClient {
  filterHints(prefix: string): void;

  requestHintCount(viewSize: Size, framePosition: Point): void;

  createHints(viewSize: Size, framePosition: Point, tags: string[]): void;

  clearHints(): void;

  activateIfExists(tag: string, newTab: boolean, background: boolean): void;
}

@injectable()
export class FollowSlaveClientImpl implements FollowSlaveClient {
  constructor(
    @inject("WindowMessageSender")
    private readonly sender: WindowMessageSender
  ) {}

  filterHints(prefix: string): void {
    this.sender.send("follow.show.hints", { prefix });
  }

  requestHintCount(viewSize: Size, framePosition: Point): void {
    this.sender.send("follow.request.count.targets", {
      viewSize,
      framePosition,
    });
  }

  createHints(viewSize: Size, framePosition: Point, tags: string[]): void {
    this.sender.send("follow.create.hints", { viewSize, framePosition, tags });
  }

  clearHints(): void {
    this.sender.send("follow.remove.hints");
  }

  activateIfExists(tag: string, newTab: boolean, background: boolean): void {
    this.sender.send("follow.activate", { tag, newTab, background });
  }
}
