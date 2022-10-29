import Search from "../../shared/settings/Search";
import CachedSettingRepository from "../repositories/CachedSettingRepository";

export default interface SearchEngineSettings {
  get(): Promise<Search>;
}

export class SearchEngineSettingsImpl {
  constructor(
    private readonly cachedSettingRepository: CachedSettingRepository
  ) {}

  async get(): Promise<Search> {
    const settings = await this.cachedSettingRepository.get();
    return settings.search;
  }
}
