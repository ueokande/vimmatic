import ContentMessageClient from "../infrastructures/ContentMessageClient";
import CachedSettingRepository from "../repositories/CachedSettingRepository";

export default interface PropertySettings {
  setProperty(key: string, value: string | number | boolean): Promise<void>;
}

export class PropertySettingsImpl {
  constructor(
    private readonly cachedSettingRepository: CachedSettingRepository,
    private readonly contentMessageClient: ContentMessageClient
  ) {}

  async setProperty(
    key: string,
    value: string | number | boolean
  ): Promise<void> {
    await this.cachedSettingRepository.setProperty(key, value);

    return this.contentMessageClient.broadcastSettingsChanged();
  }
}
