import { inject, injectable } from "inversify";
import { AddonEnabledClient } from "../client/AddonEnabledClient";
import { ConsoleFramePresenter } from "../presenters/ConsoleFramePresenter";
import { AddonEnabledRepository } from "../repositories/AddonEnabledRepository";
import { AddressRepository } from "../repositories/AddressRepository";
import { SettingRepository } from "../repositories/SettingRepository";

@injectable()
export class AddonEnabledUseCase {
  constructor(
    @inject(AddonEnabledRepository)
    private readonly addonEnabledRepository: AddonEnabledRepository,
    @inject(ConsoleFramePresenter)
    private readonly consoleFramePresenter: ConsoleFramePresenter,
    @inject(SettingRepository)
    private readonly settingRepository: SettingRepository,
    @inject(AddressRepository)
    private readonly addressRepository: AddressRepository,
    @inject(AddonEnabledClient)
    private readonly addonEnabledClient: AddonEnabledClient,
  ) {}

  fetchTabEnabled(): Promise<boolean> {
    return this.addonEnabledClient.isEnabled();
  }

  async sync(): Promise<void> {
    const tabEnabled = await this.fetchTabEnabled();
    this.applyTabEnabled(tabEnabled);
  }

  applyTabEnabled(tabEnabled: boolean): void {
    const url = this.addressRepository.getCurrentURL();
    const blacklisted = this.settingRepository
      .getBlacklist()
      .includesEntireBlacklist(url);
    if (tabEnabled && !blacklisted) {
      this.enable();
    } else {
      this.disable();
    }
  }

  enable() {
    this.addonEnabledRepository.enable();
    if (this.consoleFramePresenter.isTopWindow()) {
      this.consoleFramePresenter.attach();
    }
  }

  disable() {
    this.addonEnabledRepository.disable();
    if (this.consoleFramePresenter.isTopWindow()) {
      this.consoleFramePresenter.detach();
    }
  }

  isEnabled(): boolean {
    return this.addonEnabledRepository.isEnabled();
  }
}
