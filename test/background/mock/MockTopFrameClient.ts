import type TopFrameClient from "../../../src/background/clients/TopFrameClient";
import type {
  Rect,
  Point,
} from "../../../src/background/clients/TopFrameClient";

export default class MockTopFrameClient implements TopFrameClient {
  getWindowViewport(_tabId: number): Promise<Rect> {
    throw new Error("not implemented");
  }

  getFramePosition(
    _tabId: number,
    _frameId: number
  ): Promise<Point | undefined> {
    throw new Error("not implemented");
  }
}
