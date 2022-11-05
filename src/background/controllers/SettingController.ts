import { injectable, inject } from "inversify";
import { serialize } from "../../settings";
import SettingsRepository from "../settings/SettingsRepository";
import PropertySettings from "../settings/PropertySettings";

@injectable()
export default class SettingController {
  constructor(
    @inject("SettingsRepository")
    private readonly settingsRepository: SettingsRepository,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings
  ) {}

  async getSetting(): Promise<unknown> {
    return serialize(await this.settingsRepository.load());
  }

  async getProperty(name: string): Promise<string | number | boolean> {
    return this.propertySettings.getProperty(name);
  }
}
