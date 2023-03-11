import { injectable } from "inversify";
import MemoryStorage from "../db/MemoryStorage";

type State = { [tabId: number]: { [frameId: number]: number } };

export default interface ReadyFrameRepository {
  addFrameId(tabId: number, frameId: number): void;

  removeFrameId(tabId: number, frameId: number): void;

  getFrameIds(tabId: number): number[] | undefined;
}

@injectable()
export class ReadyFrameRepositoryImpl implements ReadyFrameRepository {
  private readonly cache = new MemoryStorage<State>(
    ReadyFrameRepositoryImpl.name,
    {}
  );

  addFrameId(tabId: number, frameId: number): void {
    let state: State | undefined = this.cache.get();
    if (typeof state === "undefined") {
      state = {};
    }
    const tab = state[tabId] || {};
    tab[frameId] = (tab[frameId] || 0) + 1;
    state[tabId] = tab;
    this.cache.set(state);
  }

  removeFrameId(tabId: number, frameId: number): void {
    const state: State | undefined = this.cache.get();
    if (typeof state === "undefined") {
      return;
    }
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

    this.cache.set(state);
  }

  getFrameIds(tabId: number): number[] | undefined {
    const state: State | undefined = this.cache.get();
    if (typeof state === "undefined") {
      return undefined;
    }
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
