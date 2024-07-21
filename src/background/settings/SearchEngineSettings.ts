import { injectable, inject } from "inversify";
import { SettingsRepository } from "./SettingsRepository";
import type { Search } from "../../shared/search";
import { defaultSettings } from "../../settings";

export interface SearchEngineSettings {
  get(): Promise<Search>;
}

export const SearchEngineSettings = Symbol("SearchEngineSettings");

@injectable()
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
