import type { FindClient } from "../../../src/background/clients/FindClient";
import type { FindQuery } from "../../../src/shared/findQuery";

export default class MockFindClient implements FindClient {
  findNext(
    _tabId: number,
    _frameId: number,
    _query: FindQuery,
  ): Promise<boolean> {
    throw new Error("not implemented");
  }

  findPrev(
    _tabId: number,
    _frameId: number,
    _query: FindQuery,
  ): Promise<boolean> {
    throw new Error("not implemented");
  }

  clearSelection(_tabId: number, _frameId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
