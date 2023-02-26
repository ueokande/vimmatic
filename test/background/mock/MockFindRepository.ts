import FindRepository, {
  FindState,
} from "../../../src/background/repositories/FindRepository";

export default class MockFindRepository implements FindRepository {
  private globalKeyword: string | undefined;
  private localStates: { [tabId: number]: FindState } = {};

  getGlobalKeyword(): string | undefined {
    return this.globalKeyword;
  }

  setGlobalKeyword(keyword: string): void {
    this.globalKeyword = keyword;
  }

  getLocalState(tabId: number): FindState | undefined {
    return this.localStates[tabId];
  }

  setLocalState(tabId: number, state: FindState): void {
    this.localStates[tabId] = state;
  }

  deleteLocalState(tabId: number): void {
    delete this.localStates[tabId];
  }
}
