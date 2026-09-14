import { provide } from "@inversifyjs/binding-decorators";
import type { LocalCache } from "../db/LocalStorage";
import { LocalCacheImpl } from "../db/LocalStorage";

// Tracks, per tab, the set of frame ids that currently report an editable
// element focused.  The tab is in insert mode iff this set is non-empty.  A
// set (rather than a single boolean) is required because a tab has multiple
// frames: a child iframe holding focus must keep the tab in insert mode even
// though the top frame reports "not focused".
type State = { [tabId: number]: number[] };

export interface FocusedFrameRepository {
  // Records the frame's editable-focus state and returns whether ANY frame in
  // the tab is now focused.
  setFocused(
    tabId: number,
    frameId: number,
    focused: boolean,
  ): Promise<boolean>;

  // Clears a frame (e.g. when it unloads) and returns whether any frame in the
  // tab is still focused.
  removeFrame(tabId: number, frameId: number): Promise<boolean>;

  clearTab(tabId: number): Promise<void>;
}

export const FocusedFrameRepository = Symbol("FocusedFrameRepository");

@provide(FocusedFrameRepository)
export class FocusedFrameRepositoryImpl implements FocusedFrameRepository {
  // Serializes read-modify-write cycles; focus/blur bursts from several frames
  // would otherwise interleave and lose updates.  Mirrors `ReadyFrameRepository`.
  private queue: Promise<boolean> = Promise.resolve(false);

  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl<State>(
      FocusedFrameRepositoryImpl.name,
      {},
    ),
  ) {}

  private enqueue(task: () => Promise<boolean>): Promise<boolean> {
    const next = this.queue.then(task, task);
    this.queue = next.catch(() => false);
    return next;
  }

  setFocused(
    tabId: number,
    frameId: number,
    focused: boolean,
  ): Promise<boolean> {
    return this.enqueue(async () => {
      const state = await this.cache.getValue();
      const set = new Set(state[tabId]);
      if (focused) {
        set.add(frameId);
      } else {
        set.delete(frameId);
      }
      if (set.size === 0) {
        delete state[tabId];
      } else {
        state[tabId] = Array.from(set);
      }
      await this.cache.setValue(state);
      return set.size > 0;
    });
  }

  removeFrame(tabId: number, frameId: number): Promise<boolean> {
    return this.setFocused(tabId, frameId, false);
  }

  clearTab(tabId: number): Promise<void> {
    return this.enqueue(async () => {
      const state = await this.cache.getValue();
      delete state[tabId];
      await this.cache.setValue(state);
      return false;
    }).then(() => undefined);
  }
}
