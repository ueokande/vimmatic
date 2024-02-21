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
    if (typeof this.value.keymaps === "undefined") {
      throw new Error("keymaps is not defined");
    }
    return this.value.keymaps;
  }

  getBlacklist(): Blacklist {
    return new Blacklist([]);
  }

  getSearch(): Search {
    if (typeof this.value.search === "undefined") {
      throw new Error("search is not defined");
    }
    return this.value.search;
  }

  getProperties(): Properties {
    if (typeof this.value.properties === "undefined") {
      throw new Error("properties is not defined");
    }
    return this.value.properties;
  }

  getStyle(component: ComponentName): CSS {
    if (typeof this.value.styles === "undefined") {
      throw new Error("styles is not defined");
    }
    const value = this.value.styles[component];
    if (typeof value === "undefined") {
      throw new Error(`styles.${component} is not defined`);
    }
    return value;
  }
}
