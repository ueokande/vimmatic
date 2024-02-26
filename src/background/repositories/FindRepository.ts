import { injectable } from "inversify";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";

export type FindState = {
  keyword: string;
  frameId: number;
};

type State = {
  global?: string;
  local: { [tabId: number]: FindState };
};

export interface FindRepository {
  getGlobalKeyword(): Promise<string | undefined>;

  setGlobalKeyword(keyword: string): Promise<void>;

  getLocalState(tabId: number): Promise<undefined | FindState>;

  setLocalState(tabId: number, state: FindState): Promise<void>;

  deleteLocalState(tabId: number): Promise<void>;
}

@injectable()
export class FindRepositoryImpl implements FindRepository {
  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl(
      FindRepositoryImpl.name,
      { local: {} },
    ),
  ) {}

  async getGlobalKeyword(): Promise<string | undefined> {
    const state = await this.cache.getValue();
    return state.global;
  }

  async setGlobalKeyword(keyword: string): Promise<void> {
    const state = await this.cache.getValue();
    state.global = keyword;
    await this.cache.setValue(state);
  }

  async getLocalState(tabId: number): Promise<FindState | undefined> {
    const state = await this.cache.getValue();
    return state.local[tabId];
  }

  async setLocalState(tabId: number, state: FindState): Promise<void> {
    const db = await this.cache.getValue();
    db.local[tabId] = state;
    await this.cache.setValue(db);
  }

  async deleteLocalState(tabId: number): Promise<void> {
    const states = await this.cache.getValue();
    delete states.local[tabId];
    await this.cache.setValue(states);
  }
}
