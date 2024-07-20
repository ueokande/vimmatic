import type { LastSelectedTabRepository } from "../../../src/background/repositories/LastSelectedTabRepository";

export class MockLastSelectedTabRepository
  implements LastSelectedTabRepository
{
  getLastSelectedTabId(): Promise<number | undefined> {
    throw new Error("not implemented");
  }

  setCurrentTabId(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
