import { injectable, inject } from "inversify";
import { SettingsRepository } from "./SettingsRepository";
import type { ComponentName } from "../../shared/styles";
import { defaultSettings } from "../../settings";

export interface StyleSettings {
  getStyle(name: string): Promise<Record<string, string>>;
}

export const StyleSettings = Symbol("StyleSettings");

@injectable()
export class StyleSettingsImpl {
  constructor(
    @inject(SettingsRepository)
    private readonly settingsRepository: SettingsRepository,
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
