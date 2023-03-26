import FindHistoryRepository from "../../../src/background/repositories/FindHistoryRepository";

export default class MockFindHistoryRepository
  implements FindHistoryRepository
{
  append(_keyword: string): Promise<void> {
    throw new Error("not implemented");
  }

  query(_prefix: string): Promise<string[]> {
    throw new Error("not implemented");
  }
}
