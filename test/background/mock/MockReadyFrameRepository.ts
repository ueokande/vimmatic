import ReadyFrameRepository from "../../../src/background/repositories/ReadyFrameRepository";

export default class MockReadyFrameRepository implements ReadyFrameRepository {
  addFrameId(_tabId: number, _fraemId: number): void {
    throw new Error("not implemented");
  }

  removeFrameId(_tabId: number, _frameId: number): void {
    throw new Error("not implemented");
  }

  getFrameIds(_tabId: number): number[] | undefined {
    throw new Error("not implemented");
  }
}
