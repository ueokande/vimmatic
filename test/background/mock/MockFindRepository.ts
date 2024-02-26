import type {
  FindRepository,
  FindState,
} from "../../../src/background/repositories/FindRepository";

export default class MockFindRepository implements FindRepository {
  private globalKeyword: string | undefined;
  private localStates: { [tabId: number]: FindState } = {};

  async getGlobalKeyword(): Promise<string | undefined> {
    return this.globalKeyword;
  }

  async setGlobalKeyword(keyword: string): Promise<void> {
    this.globalKeyword = keyword;
  }

  async getLocalState(tabId: number): Promise<FindState | undefined> {
    return this.localStates[tabId];
  }

  async setLocalState(tabId: number, state: FindState): Promise<void> {
    this.localStates[tabId] = state;
  }

  async deleteLocalState(tabId: number): Promise<void> {
    delete this.localStates[tabId];
  }
}
