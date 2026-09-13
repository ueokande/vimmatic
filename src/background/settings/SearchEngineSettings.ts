import { provide } from "@inversifyjs/binding-decorators";
import { inject } from "inversify";
import { defaultSettings } from "../../settings";
import type { Search } from "../../shared/search";
import { SettingsRepository } from "./SettingsRepository";

export interface SearchEngineSettings {
  get(): Promise<Search>;
}

export const SearchEngineSettings = Symbol("SearchEngineSettings");

@provide(SearchEngineSettings)
export class SearchEngineSettingsImpl {
  constructor(
    @inject(SettingsRepository)
    private readonly settingsRepository: SettingsRepository,
  ) {}

  async get(): Promise<Search> {
    const settings = await this.settingsRepository.load();
    return settings.search || defaultSettings.search!;
  }
}
