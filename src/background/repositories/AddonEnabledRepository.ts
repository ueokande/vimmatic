import { provide } from "@inversifyjs/binding-decorators";
import type { LocalCache } from "../db/LocalStorage";
import { LocalCacheImpl } from "../db/LocalStorage";

export interface AddonEnabledRepository {
  isEnabled(tabId: number): Promise<boolean>;

  setEnabled(tabId: number, enabled: boolean): Promise<void>;

  toggle(tabId: number): Promise<boolean>;

  delete(tabId: number): Promise<void>;
}

// Only disabled tabs are stored so that tabs default to enabled without
// pre-registration.
type State = Record<string, boolean>;

export const AddonEnabledRepository = Symbol("AddonEnabledRepository");

// Updates are read-modify-write on a single storage entry, so concurrent
// updates (e.g. repeated key presses) are serialized to avoid lost writes.
let queue: Promise<unknown> = Promise.resolve();
const serialize = <T>(f: () => Promise<T>): Promise<T> => {
  const next = queue.then(f, f);
  queue = next.catch(() => {});
  return next;
};

@provide(AddonEnabledRepository)
export class AddonEnabledRepositoryImpl implements AddonEnabledRepository {
  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl<State>(
      AddonEnabledRepositoryImpl.name,
      {},
    ),
  ) {}

  async isEnabled(tabId: number): Promise<boolean> {
    const state = await this.cache.getValue();
    return state[tabId] ?? true;
  }

  setEnabled(tabId: number, enabled: boolean): Promise<void> {
    return serialize(() => this.write(tabId, enabled));
  }

  toggle(tabId: number): Promise<boolean> {
    return serialize(async () => {
      const enabled = !(await this.isEnabled(tabId));
      await this.write(tabId, enabled);
      return enabled;
    });
  }

  delete(tabId: number): Promise<void> {
    return serialize(() => this.write(tabId, true));
  }

  private async write(tabId: number, enabled: boolean): Promise<void> {
    const state = { ...(await this.cache.getValue()) };
    if (enabled) {
      delete state[tabId];
    } else {
      state[tabId] = false;
    }
    await this.cache.setValue(state);
  }
}
