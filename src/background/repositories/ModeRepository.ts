import { provide } from "@inversifyjs/binding-decorators";
import { Mode } from "../../shared/mode";
import type { LocalCache } from "../db/LocalStorage";
import { LocalCacheImpl } from "../db/LocalStorage";

// The mode is tracked per tab, just like `ReadyFrameRepository`.  Previously
// this was a single global value shared across every tab, which meant switching
// tabs (or operating two tabs at once) leaked one tab's mode into another.  A
// tab that has no entry is implicitly in `Mode.Normal`.
type State = { [tabId: number]: Mode };

export interface ModeRepository {
  getMode(tabId: number): Promise<Mode>;
  setMode(tabId: number, mode: Mode): Promise<void>;
}

export const ModeRepository = Symbol("ModeRepository");

@provide(ModeRepository)
export class ModeRepositoryImpl implements ModeRepository {
  // Serializes the read-modify-write against the backing cache so that bursty
  // updates (e.g. focus/blur events arriving from several frames at once) do
  // not interleave and clobber each other.  Mirrors `ReadyFrameRepository`.
  private queue: Promise<void> = Promise.resolve();

  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl<State>(
      ModeRepositoryImpl.name,
      {},
    ),
  ) {}

  private enqueue(task: () => Promise<void>): Promise<void> {
    const next = this.queue.then(task, task);
    // Keep the chain alive even if a task rejects.
    this.queue = next.catch(() => undefined);
    return next;
  }

  // Guards against data written by an older version of the extension, when this
  // same storage key held a single `Mode` string rather than a per-tab map.
  // Reading that stale string and treating it as the map would make
  // `state[tabId] = ...` assign onto a string and throw
  // ("can't assign to property N on \"normal\": not an object").  Anything that
  // is not a plain object is discarded and treated as "no modes set".
  private normalize(value: unknown): State {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return {};
    }
    return value as State;
  }

  async getMode(tabId: number): Promise<Mode> {
    const state = this.normalize(await this.cache.getValue());
    return state[tabId] ?? Mode.Normal;
  }

  setMode(tabId: number, mode: Mode): Promise<void> {
    return this.enqueue(async () => {
      const state = this.normalize(await this.cache.getValue());
      if (mode === Mode.Normal) {
        // Normal is the implicit default; drop the entry to keep the store
        // small and to avoid stale entries lingering after a tab is closed.
        delete state[tabId];
      } else {
        state[tabId] = mode;
      }
      await this.cache.setValue(state);
    });
  }
}
