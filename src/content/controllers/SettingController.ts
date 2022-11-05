import { injectable, inject } from "inversify";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";
import SettingRepository from "../repositories/SettingRepository";
import * as messages from "../../shared/messages";

@injectable()
export default class SettingController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
    @inject("SettingRepository")
    private readonly settingRepostory: SettingRepository
  ) {}

  async initSettings(): Promise<void> {
    try {
      await this.settingRepostory.reload();

      const url = new URL(window.location.href);
      const disabled = this.settingRepostory
        .getBlacklist()
        .includesEntireBlacklist(url);
      if (disabled) {
        await this.addonEnabledUseCase.disable();
      } else {
        await this.addonEnabledUseCase.enable();
      }
    } catch (e) {
      // Sometime sendMessage fails when background script is not ready.
      console.warn(e);
      setTimeout(() => this.initSettings(), 500);
    }
  }

  async reloadSettings(_message: messages.Message): Promise<void> {
    await this.settingRepostory.reload();
  }
}
