import { injectable, inject } from "inversify";
import SettingsUseCase from "../usecases/SettingsUseCase";
import RequestContext from "./RequestContext";

@injectable()
export default class SettingsController {
  constructor(
    @inject(SettingsUseCase)
    private readonly settingsUseCase: SettingsUseCase
  ) {}

  async getSettings(_ctx: RequestContext): Promise<unknown> {
    return this.settingsUseCase.getSettings();
  }

  async getProperty(
    _ctx: RequestContext,
    {
      name,
    }: {
      name: string;
    }
  ): Promise<string | number | boolean> {
    return this.settingsUseCase.getProperty(name);
  }

  async validate(
    _ctx: RequestContext,
    { settings }: { settings: unknown }
  ): Promise<{ error?: string }> {
    const error = await this.settingsUseCase.validate(settings);
    return { error };
  }
}
