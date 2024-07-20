import type { ReadyFrameRepository } from "../../../src/background/repositories/ReadyFrameRepository";

export class MockReadyFrameRepository implements ReadyFrameRepository {
  addFrameId(_tabId: number, _fraemId: number): Promise<void> {
    throw new Error("not implemented");
  }

  removeFrameId(_tabId: number, _frameId: number): Promise<void> {
    throw new Error("not implemented");
  }

  getFrameIds(_tabId: number): Promise<number[] | undefined> {
    throw new Error("not implemented");
  }
}
