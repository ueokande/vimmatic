import SettingRepository from "../../../src/content/repositories/SettingRepository";
import { defaultSettings } from "../../../src/settings";
import type Settings from "../../../src/shared/Settings";
import Blacklist from "../../../src/shared/Blacklist";
import type Keymaps from "../../../src/shared/Keymaps";
import type Properties from "../../../src/shared/Properties";
import type Search from "../../../src/shared/Search";
import type { ComponentName, CSS } from "../../../src/shared/Styles";

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

  getStyle(component: ComponentName): CSS {
    return this.value.styles[component];
  }
}
