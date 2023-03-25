import { injectable, inject } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";
import Settings from "../../shared/Settings";
import { defaultSettings, serialize, deserialize } from "../../settings";
import { SerializedSettings } from "../../settings/schema";

type OnChangeListener = (value: Settings) => unknown;

export default interface SettingsRepository {
  load(): Promise<Settings>;

  save(value: Settings): Promise<void>;

  onChanged(f: OnChangeListener): void;
}

@injectable()
export class PermanentSettingsRepository implements SettingsRepository {
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
export class TransientSettingsRepository implements SettingsRepository {
  constructor(
    @inject("PermanentSettingsRepository")
    private readonly permanent: SettingsRepository,
    private readonly cache: LocalCache<
      SerializedSettings | undefined
    > = new LocalCacheImpl(TransientSettingsRepository.name, undefined)
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
