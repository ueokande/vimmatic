import { injectable } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";

type State = { [tabId: number]: { [frameId: number]: number } };

export default interface ReadyFrameRepository {
  addFrameId(tabId: number, frameId: number): Promise<void>;

  removeFrameId(tabId: number, frameId: number): Promise<void>;

  getFrameIds(tabId: number): Promise<number[] | undefined>;
}

@injectable()
export class ReadyFrameRepositoryImpl implements ReadyFrameRepository {
  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl(
      ReadyFrameRepositoryImpl.name,
      {}
    )
  ) {}

  async addFrameId(tabId: number, frameId: number): Promise<void> {
    const state = await this.cache.getValue();
    const tab = state[tabId] || {};
    tab[frameId] = (tab[frameId] || 0) + 1;
    state[tabId] = tab;
    await this.cache.setValue(state);
  }

  async removeFrameId(tabId: number, frameId: number): Promise<void> {
    const state = await this.cache.getValue();
    const ids = state[tabId];
    if (typeof ids === "undefined") {
      return;
    }
    const tab = state[tabId] || {};
    tab[frameId] = (tab[frameId] || 0) - 1;
    if (tab[frameId] == 0) {
      delete tab[frameId];
    }
    if (Object.keys(tab).length === 0) {
      delete state[tabId];
    }

    await this.cache.setValue(state);
  }

  async getFrameIds(tabId: number): Promise<number[] | undefined> {
    const state = await this.cache.getValue();
    const tab = state[tabId];
    if (typeof tab === "undefined") {
      return undefined;
    }
    const frameIds = Object.keys(tab)
      .map((v) => Number(v))
      .sort();
    return frameIds;
  }
}
