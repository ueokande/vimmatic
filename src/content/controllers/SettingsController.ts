import { inject, injectable } from "inversify";
import { SettingRepository } from "../repositories/SettingRepository";
import { AddonEnabledUseCase } from "../usecases/AddonEnabledUseCase";

@injectable()
export class SettingsController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
    @inject(SettingRepository)
    private readonly settingRepostory: SettingRepository,
  ) {}

  async initSettings(): Promise<void> {
    try {
      const [, tabEnabled] = await Promise.all([
        this.settingRepostory.reload(),
        this.addonEnabledUseCase.fetchTabEnabled(),
      ]);
      this.addonEnabledUseCase.applyTabEnabled(tabEnabled);
    } catch (e) {
      // Sometime sendMessage fails when background script is not ready.
      // biome-ignore lint/suspicious/noConsole: intentional debug logging
      console.warn(e);
      setTimeout(() => this.initSettings(), 1000);
    }
  }

  async reloadSettings(): Promise<void> {
    await this.settingRepostory.reload();
    // The blacklist may have changed.
    await this.addonEnabledUseCase.sync();
  }
}
