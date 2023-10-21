import { injectable } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";

type State = { [tabId: number]: number[] };

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
      {},
    ),
  ) {}

  async addFrameId(tabId: number, frameId: number): Promise<void> {
    const state = await this.cache.getValue();

    if (frameId === 0) {
      // top frame is reloaded, flush frame IDs
      state[tabId] = [frameId];
    } else {
      const s = new Set(state[tabId]);
      s.add(frameId);
      state[tabId] = Array.from(s);
    }
    await this.cache.setValue(state);
  }

  async removeFrameId(tabId: number, frameId: number): Promise<void> {
    const state = await this.cache.getValue();
    const ids = state[tabId];
    if (typeof ids === "undefined") {
      return;
    }

    if (frameId === 0) {
      // top frame is closed, flush frame IDs
      delete state[tabId];
    } else {
      const s = new Set(ids);
      s.delete(frameId);

      if (s.size === 0) {
        delete state[frameId];
      } else {
        state[tabId] = Array.from(s);
      }
    }

    await this.cache.setValue(state);
  }

  async getFrameIds(tabId: number): Promise<number[] | undefined> {
    const state = await this.cache.getValue();
    const frameIds = state[tabId];
    if (typeof frameIds === "undefined") {
      return undefined;
    }

    return frameIds.sort();
  }
}
