import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";

export type FindState = {
  keyword: string;
  frameId: number;
};

type State = {
  global?: string;
  local: { [tabId: number]: FindState };
};

export default interface FindRepository {
  getGlobalKeyword(): string | undefined;

  setGlobalKeyword(keyword: string): void;

  getLocalState(tabId: number): undefined | FindState;

  setLocalState(tabId: number, state: FindState): void;

  deleteLocalState(tabId: number): void;
}

@injectable()
export class FindRepositoryImpl implements FindRepository {
  private readonly cache = new MemoryStorage<State>(FindRepositoryImpl.name, {
    local: {},
  });

  getGlobalKeyword(): string | undefined {
    return this.cache.get().global;
  }

  setGlobalKeyword(keyword: string): void {
    const state = this.cache.get();
    state.global = keyword;
    this.cache.set(state);
  }

  getLocalState(tabId: number): FindState | undefined {
    const state = this.cache.get();
    return state.local[tabId];
  }

  setLocalState(tabId: number, state: FindState): void {
    const db = this.cache.get();
    db.local[tabId] = state;
    this.cache.set(db);
  }

  deleteLocalState(tabId: number): void {
    const states = this.cache.get();
    delete states.local[tabId];
    this.cache.set(states);
  }
}
