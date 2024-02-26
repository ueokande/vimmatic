import { injectable, inject } from "inversify";
import { serialize, deserialize } from "../../settings";
import type { SettingsRepository } from "../settings/SettingsRepository";
import type { PropertySettings } from "../settings/PropertySettings";
import type { StyleSettings } from "../settings/StyleSettings";
import Validator from "../settings/Validator";

@injectable()
export default class SettingsUseCase {
  constructor(
    @inject("SettingsRepository")
    private readonly settingsRepository: SettingsRepository,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings,
    @inject("StyleSettings")
    private readonly styleSettings: StyleSettings,
    @inject(Validator)
    private readonly validator: Validator,
  ) {}

  async getSettings(): Promise<unknown> {
    return serialize(await this.settingsRepository.load());
  }

  async getProperty(name: string): Promise<string | number | boolean> {
    return this.propertySettings.getProperty(name);
  }

  async getStyle(name: string): Promise<Record<string, string>> {
    return this.styleSettings.getStyle(name);
  }

  async validate(data: unknown): Promise<string | undefined> {
    try {
      this.validator.validate(deserialize(data));
    } catch (e) {
      return Promise.resolve(e.message);
    }
    return Promise.resolve(undefined);
  }
}
