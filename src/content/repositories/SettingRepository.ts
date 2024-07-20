import { injectable, inject } from "inversify";
import { Blacklist } from "../../shared/blacklist";
import type { Keymaps } from "../../shared/keymaps";
import type { Properties } from "../../shared/properties";
import type { Search } from "../../shared/search";
import type { ComponentName, CSS } from "../../shared/styles";
import type { SettingClient } from "../client/SettingClient";
import { defaultSettings } from "../../settings";
import type { Settings } from "../../shared/settings";

let current: Settings = defaultSettings;

export interface SettingRepository {
  reload(): Promise<void>;

  getKeymaps(): Keymaps;

  getBlacklist(): Blacklist;

  getSearch(): Search;

  getProperties(): Properties;

  getStyle(component: ComponentName): CSS;
}

@injectable()
export class SettingRepositoryImpl implements SettingRepository {
  constructor(
    @inject("SettingClient")
    private readonly client: SettingClient,
  ) {}

  async reload(): Promise<void> {
    current = await this.client.load();
  }

  getKeymaps(): Keymaps {
    return current.keymaps || defaultSettings.keymaps!;
  }

  getBlacklist(): Blacklist {
    return current.blacklist || new Blacklist([]);
  }

  getSearch(): Search {
    return current.search || defaultSettings.search!;
  }

  getProperties(): Properties {
    return {
      ...defaultSettings.properties!,
      ...current.properties,
    };
  }

  getStyle(component: ComponentName): CSS {
    return (
      (current.styles && current.styles[component]) ||
      defaultSettings.styles![component]!
    );
  }
}
