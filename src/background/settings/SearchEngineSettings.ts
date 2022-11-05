import { injectable, inject } from "inversify";
import SettingsRepository from "./SettingsRepository";
import Search from "../../shared/Search";
import { defaultSettings } from "../../settings";

export default interface SearchEngineSettings {
  get(): Promise<Search>;
}

@injectable()
export class SearchEngineSettingsImpl {
  constructor(
    @inject("SettingsRepository")
    private readonly settingsRepository: SettingsRepository
  ) {}

  async get(): Promise<Search> {
    const settings = await this.settingsRepository.load();
    return settings.search || defaultSettings.search!;
  }
}
