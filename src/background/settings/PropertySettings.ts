import ContentMessageClient from "../infrastructures/ContentMessageClient";
import CachedSettingRepository from "../repositories/CachedSettingRepository";
import PropertyRegistry from "../property/PropertyRegistry";

export default interface PropertySettings {
  setProperty(name: string, value: string | number | boolean): Promise<void>;

  getProperty(name: string): Promise<string | number | boolean>;
}

export class PropertySettingsImpl {
  constructor(
    private readonly propertyRegistry: PropertyRegistry,
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
    const value = settings.properties[name];
    const prop = this.propertyRegistry.getProperty(name);
    if (typeof prop === "undefined") {
      throw new Error(`Unknown property: ${name}`);
    }
    if (typeof value === "undefined") {
      return prop.defaultValue();
    }
    try {
      prop.validate(value);
    } catch (e) {
      console.warn(`Property ${name} has invalid value: ${e.message}`);
      return prop.defaultValue();
    }
    return value;
  }
}
