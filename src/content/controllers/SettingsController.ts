import { injectable, inject } from "inversify";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";
import SettingRepository from "../repositories/SettingRepository";

@injectable()
export default class SettingsController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
    @inject("SettingRepository")
    private readonly settingRepostory: SettingRepository,
  ) {}

  async initSettings(): Promise<void> {
    try {
      await this.settingRepostory.reload();

      const url = new URL(window.location.href);
      const disabled = this.settingRepostory
        .getBlacklist()
        .includesEntireBlacklist(url);
      if (disabled) {
        this.addonEnabledUseCase.disable();
      } else {
        this.addonEnabledUseCase.enable();
      }
    } catch (e) {
      // Sometime sendMessage fails when background script is not ready.
      console.warn(e);
      setTimeout(() => this.initSettings(), 1000);
    }
  }

  async reloadSettings(): Promise<void> {
    await this.settingRepostory.reload();
  }
}
