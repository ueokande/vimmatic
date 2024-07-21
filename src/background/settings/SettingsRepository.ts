import { injectable, inject } from "inversify";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";
import type { Settings } from "../../shared/settings";
import { defaultSettings, serialize, deserialize } from "../../settings";
import type { SerializedSettings } from "../../settings/schema";

type OnChangeListener = (value: Settings) => unknown;

export interface SettingsRepository {
  load(): Promise<Settings>;

  save(value: Settings): Promise<void>;

  onChanged(f: OnChangeListener): void;
}

export const SettingsRepository = Symbol("SettingsRepository");
export const PermanentSettingsRepository = Symbol(
  "PermanentSettingsRepository",
);

@injectable()
export class PermanentSettingsRepositoryImpl implements SettingsRepository {
  async load(): Promise<Settings> {
    const { settings } = await chrome.storage.sync.get("settings");
    if (!settings) {
      return defaultSettings;
    }
    try {
      return deserialize(settings);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("settings may be storage is broken:", e);
      // eslint-disable-next-line no-console
      console.warn("loaded settings is:", settings);
      return defaultSettings;
    }
  }

  async save(_value: Settings): Promise<void> {
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
        // eslint-disable-next-line no-console
        console.warn("settings may be storage is broken:", e);
        // eslint-disable-next-line no-console
        console.warn("loaded settings is:", changes.settings.newValue);
        return;
      }

      f(settings);
    });
  }
}

@injectable()
export class TransientSettingsRepositoryImpl implements SettingsRepository {
  constructor(
    @inject(PermanentSettingsRepository)
    private readonly permanent: SettingsRepository,
    private readonly cache: LocalCache<
      SerializedSettings | undefined
    > = new LocalCacheImpl(TransientSettingsRepositoryImpl.name, undefined),
  ) {
    this.permanent.onChanged(this.sync.bind(this));
  }

  async load(): Promise<Settings> {
    const cached = await this.cache.getValue();
    if (typeof cached !== "undefined") {
      return deserialize(cached);
    }

    const settings = await this.permanent.load();
    await this.cache.setValue(serialize(settings));
    return settings;
  }

  save(value: Settings): Promise<void> {
    return this.cache.setValue(serialize(value));
  }

  onChanged(_f: OnChangeListener): void {
    throw new Error("unsupported operation");
  }

  private async sync(newValue: Settings) {
    await this.cache.setValue(serialize(newValue));
  }
}
