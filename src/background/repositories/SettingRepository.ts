import { injectable } from "inversify";
import SettingData from "../../shared/SettingData";

export default interface SettingRepository {
  load(): Promise<SettingData | null>;

  onChange(callback: () => void): void;
}

@injectable()
export class LocalSettingRepository implements SettingRepository {
  async load(): Promise<SettingData | null> {
    const { settings } = await browser.storage.local.get("settings");
    if (!settings) {
      return null;
    }
    return SettingData.fromJSON(settings as any);
  }

  onChange(callback: () => void) {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") {
        return;
      }
      if (changes.settings) {
        callback();
      }
    });
  }
}

@injectable()
export class SyncSettingRepository implements SettingRepository {
  async load(): Promise<SettingData | null> {
    const { settings } = await browser.storage.sync.get("settings");
    if (!settings) {
      return null;
    }
    return SettingData.fromJSON(settings as any);
  }

  onChange(callback: () => void) {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") {
        return;
      }
      if (changes.settings) {
        callback();
      }
    });
  }
}
