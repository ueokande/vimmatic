import type { PropertyName } from "../../shared/settings/Properties";
import ContentMessageClient from "../infrastructures/ContentMessageClient";
import CachedSettingRepository from "../repositories/CachedSettingRepository";

export default interface PropertySettings {
  setProperty(name: string, value: string | number | boolean): Promise<void>;

  getProperty(name: string): Promise<string | number | boolean>;
}

export class PropertySettingsImpl {
  constructor(
    private readonly cachedSettingRepository: CachedSettingRepository,
    private readonly contentMessageClient: ContentMessageClient
  ) {}

  async setProperty(
    name: string,
    value: string | number | boolean
  ): Promise<void> {
    await this.cachedSettingRepository.setProperty(name, value);

    return this.contentMessageClient.broadcastSettingsChanged();
  }

  async getProperty(name: string): Promise<string | number | boolean> {
    const settings = await this.cachedSettingRepository.get();
    const value = settings.properties[name as PropertyName];
    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
    ) {
      throw new Error(`unexpected property type of ${name}: ${typeof value}`);
    }
    return value;
  }
}
