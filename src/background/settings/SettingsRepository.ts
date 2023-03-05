import { injectable, inject } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";
import { defaultSettings, serialize, deserialize } from "../../settings";
import Settings from "../../shared/Settings";
import { SerializedSettings } from "../../settings/schema";

type OnChangeListener = (value: Settings) => unknown;

export default interface SettingsRepository {
  load(): Promise<Settings>;

  save(value: Settings): Promise<void>;

  onChanged(f: OnChangeListener): void;
}

class SettingsCache {
  private readonly cache = new MemoryStorage<SerializedSettings | null>(
    SettingsCache.name,
    null
  );

  load(): Settings | null {
    const cache = this.cache.get();
    if (cache === null) {
      return null;
    }
    return deserialize(cache);
  }

  save(value: Settings): void {
    this.cache.set(serialize(value));
  }

  invalidate() {
    this.cache.set(null);
  }
}

@injectable()
export class PersistentSettingsRepository implements SettingsRepository {
  async load(): Promise<Settings> {
    const { settings } = await chrome.storage.sync.get("settings");
    if (!settings) {
      return defaultSettings;
    }
    try {
      return deserialize(settings);
    } catch (e) {
      console.warn("settings may be storage is broken:", e);
      console.warn("loaded settings is:");
      console.warn(settings);
      return defaultSettings;
    }
  }

  save(_value: Settings): Promise<void> {
    throw new Error("unsupported operation");
  }

  onChanged(f: OnChangeListener): void {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") {
        return;
      }
      if (typeof changes.settings === "undefined") {
        return;
      }

      let settings: Settings;
      try {
        settings = deserialize(changes.settings.newValue);
      } catch (e) {
        console.warn("settings may be storage is broken:", e);
        console.warn("loaded settings is:");
        console.warn(changes.settings.newValue);
        return;
      }

      f(settings);
    });
  }
}

@injectable()
export class TransientSettingsRepotiory implements SettingsRepository {
  private readonly cache = new SettingsCache();

  private readonly onChangeListeners: Array<OnChangeListener> = [];

  constructor(
    @inject(PersistentSettingsRepository)
    private readonly origin: SettingsRepository
  ) {
    this.origin.onChanged(() => {
      this.invalidate();
    });
  }

  async load(): Promise<Settings> {
    const cache = this.cache.load();
    if (cache) {
      return cache;
    }

    const origin = await this.origin.load();
    this.save(origin);
    return origin;
  }

  save(value: Settings): Promise<void> {
    this.cache.save(value);
    this.onChangeListeners.forEach((listener) => {
      listener(value);
    });
    return Promise.resolve();
  }

  onChanged(f: OnChangeListener): void {
    this.onChangeListeners.push(f);
  }

  private async invalidate(): Promise<void> {
    this.cache.invalidate();
  }
}
