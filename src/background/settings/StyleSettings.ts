import { injectable, inject } from "inversify";
import SettingsRepository from "./SettingsRepository";
import { ComponentName } from "../../shared/Styles";
import { defaultSettings } from "../../settings";

export default interface StyleSettings {
  getStyle(name: string): Promise<Record<string, string>>;
}

@injectable()
export class StyleSettingsImpl {
  constructor(
    @inject("SettingsRepository")
    private readonly settingsRepository: SettingsRepository
  ) {}

  async getStyle(name: ComponentName): Promise<Record<string, string>> {
    const settings = await this.settingsRepository.load();
    const value = (settings.styles || {})[name];
    if (typeof value === "undefined") {
      return defaultSettings.styles![name]!;
    }
    return value;
  }
}
