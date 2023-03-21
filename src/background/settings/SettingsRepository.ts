import { injectable } from "inversify";
import { defaultSettings, deserialize } from "../../settings";
import Settings from "../../shared/Settings";

type OnChangeListener = (value: Settings) => unknown;

export default interface SettingsRepository {
  load(): Promise<Settings>;

  save(value: Settings): Promise<void>;

  onChanged(f: OnChangeListener): void;
}

@injectable()
export class SettingsRepositoryImpl implements SettingsRepository {
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
