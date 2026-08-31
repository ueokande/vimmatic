import { provide } from "inversify-binding-decorators";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";

type State = { [tabId: number]: number[] };

export interface ReadyFrameRepository {
  addFrameId(tabId: number, frameId: number): Promise<void>;

  removeFrameId(tabId: number, frameId: number): Promise<void>;

  getFrameIds(tabId: number): Promise<number[] | undefined>;
}

export const ReadyFrameRepository = Symbol("ReadyFrameRepository");

@provide(ReadyFrameRepository)
export class ReadyFrameRepositoryImpl implements ReadyFrameRepository {
  // Serializes all mutations so that the read-modify-write against the backing
  // `chrome.storage.local` cache cannot interleave.  Bursty port
  // connect/disconnect events (many frames loading/unloading at once) would
  // otherwise run overlapping getValue -> setValue cycles and clobber each
  // other, causing the frame list to drift out of sync with reality.
  //
  // A frame is registered here only after its content script has installed its
  // `chrome.runtime.onMessage` listener (the content script opens its port only
  // after `listen()`), so membership in this repository is the readiness
  // handshake: if a frame is present, it is able to receive messages.  The
  // background sends to a frame only once it is registered here, which removes
  // the send/receive race and the need for retries on the send side.
  private queue: Promise<void> = Promise.resolve();

  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl(
      ReadyFrameRepositoryImpl.name,
      {},
    ),
  ) {}

  private enqueue(task: () => Promise<void>): Promise<void> {
    const next = this.queue.then(task, task);
    // Keep the chain alive even if a task rejects.
    this.queue = next.catch(() => undefined);
    return next;
  }

  addFrameId(tabId: number, frameId: number): Promise<void> {
    return this.enqueue(async () => {
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
    });
  }

  removeFrameId(tabId: number, frameId: number): Promise<void> {
    return this.enqueue(async () => {
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
          delete state[tabId];
        } else {
          state[tabId] = Array.from(s);
        }
      }

      await this.cache.setValue(state);
    });
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
