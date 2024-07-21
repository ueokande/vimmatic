import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { PropertyRegistry } from "../property/PropertyRegistry";
import { SettingsRepository } from "./SettingsRepository";

export interface PropertySettings {
  setProperty(name: string, value: string | number | boolean): Promise<void>;

  getProperty(name: string): Promise<string | number | boolean>;
}

export const PropertySettings = Symbol("PropertySettings");

@provide(PropertySettings)
export class PropertySettingsImpl {
  constructor(
    @inject(SettingsRepository)
    private readonly settingsRepository: SettingsRepository,
    @inject(PropertyRegistry)
    private readonly propertyRegistry: PropertyRegistry,
  ) {}

  async setProperty(
    name: string,
    value: string | number | boolean,
  ): Promise<void> {
    const def = this.propertyRegistry.getProperty(name);
    if (!def) {
      throw new Error("Unknown property: " + name);
    }
    def.validate(value);

    const settings = await this.settingsRepository.load();
    const properties = { ...settings.properties, [name]: value };
    settings.properties = properties;
    await this.settingsRepository.save(settings);
  }

  async getProperty(name: string): Promise<string | number | boolean> {
    const def = this.propertyRegistry.getProperty(name);
    if (!def) {
      throw new Error("Unknown property: " + name);
    }

    const settings = await this.settingsRepository.load();
    const value = (settings.properties || {})[name];
    if (typeof value === "undefined") {
      return def.defaultValue();
    }
    try {
      def.validate(value);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Property ${name} has invalid value: ${e.message}`);
      return def.defaultValue();
    }

    return value;
  }
}
