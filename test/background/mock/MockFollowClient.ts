import type FollowClient from "../../../src/background/clients/FollowClient";
import type { Point, Size } from "../../../src/background/clients/FollowClient";

export default class MockFollowClient implements FollowClient {
  countHints(
    _tabId: number,
    _frameId: number,
    _viewSize: Size,
    _framePosition: Point
  ): Promise<number> {
    throw new Error("not implemented");
  }

  createHints(
    _tabId: number,
    _frameId: number,
    _hints: string[],
    _viewSize: Size,
    _framePosition: Point
  ): Promise<void> {
    throw new Error("not implemented");
  }

  filterHints(_tabId: number, _prefix: string): Promise<void> {
    throw new Error("not implemented");
  }

  clearHints(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  activateIfExists(
    _tabId: number,
    _tag: string,
    _newTab: boolean,
    _background: boolean
  ): Promise<void> {
    throw new Error("not implemented");
  }
}
