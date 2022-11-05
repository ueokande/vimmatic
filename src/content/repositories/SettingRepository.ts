import { injectable, inject } from "inversify";
import Blacklist from "../../shared/Blacklist";
import Keymaps from "../../shared/Keymaps";
import Properties from "../../shared/Properties";
import Search from "../../shared/Search";
import SettingClient from "../client/SettingClient";
import { defaultSettings } from "../../settings";
import Settings from "../../shared/Settings";

let current: Settings = defaultSettings;

export default interface SettingRepository {
  reload(): Promise<void>;

  getKeymaps(): Keymaps;

  getBlacklist(): Blacklist;

  getSearch(): Search;

  getProperties(): Properties;
}

@injectable()
export class SettingRepositoryImpl implements SettingRepository {
  constructor(
    @inject("SettingClient")
    private readonly client: SettingClient
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
}
