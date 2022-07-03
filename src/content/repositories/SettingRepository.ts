import { injectable } from "inversify";
import Settings, { DefaultSetting } from "../../shared/settings/Settings";

let current: Settings = DefaultSetting;

export default interface SettingRepository {
  set(setting: Settings): void;

  get(): Settings;
}

@injectable()
export class SettingRepositoryImpl implements SettingRepository {
  set(setting: Settings): void {
    current = setting;
  }

  get(): Settings {
    return current;
  }
}
