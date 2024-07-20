import type {
  TopFrameClient,
  Rect,
  Point,
} from "../../../src/background/clients/TopFrameClient";

export class MockTopFrameClient implements TopFrameClient {
  getWindowViewport(_tabId: number): Promise<Rect> {
    throw new Error("not implemented");
  }

  getFramePosition(
    _tabId: number,
    _frameId: number,
  ): Promise<Point | undefined> {
    throw new Error("not implemented");
  }
}
