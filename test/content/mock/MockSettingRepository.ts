import SettingRepository from "../../../src/content/repositories/SettingRepository";
import { defaultSettings } from "../../../src/settings";
import Settings from "../../../src/shared/Settings";
import Blacklist from "../../../src/shared/Blacklist";
import Keymaps from "../../../src/shared/Keymaps";
import Properties from "../../../src/shared/Properties";
import Search from "../../../src/shared/Search";

export default class MockSettingRepository implements SettingRepository {
  private value: Settings;

  constructor(initValue: Settings = defaultSettings) {
    this.value = initValue;
  }

  reload(): Promise<void> {
    throw new Error("not implemented");
  }

  getKeymaps(): Keymaps {
    return this.value.keymaps;
  }

  getBlacklist(): Blacklist {
    return new Blacklist([]);
  }

  getSearch(): Search {
    return this.value.search;
  }

  getProperties(): Properties {
    return this.value.properties;
  }
}
