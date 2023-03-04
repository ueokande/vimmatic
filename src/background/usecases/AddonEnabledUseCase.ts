import { inject, injectable } from "inversify";
import ToolbarPresenter from "../presenters/ToolbarPresenter";
import AddonEnabledRepository from "../repositories/AddonEnabledRepository";
import AddonEnabledClient from "../clients/AddonEnabledClient";

@injectable()
export default class AddonEnabledUseCase {
  constructor(
    @inject("ToolbarPresenter")
    private readonly toolbarPresenter: ToolbarPresenter,
    @inject("AddonEnabledRepository")
    private readonly addonEnabledRepository: AddonEnabledRepository,
    @inject("AddonEnabledClient")
    private readonly addonEnabledClient: AddonEnabledClient
  ) {}

  async enable(tabId: number): Promise<void> {
    this.addonEnabledRepository.enable();
    await this.addonEnabledClient.enable(tabId);
    await this.toolbarPresenter.setEnabled(true);
  }

  async disable(tabId: number): Promise<void> {
    this.addonEnabledRepository.disable();
    await this.addonEnabledClient.disable(tabId);
    await this.toolbarPresenter.setEnabled(false);
  }

  async toggle(tabId: number): Promise<void> {
    const enabled = this.addonEnabledRepository.toggle();
    await this.toolbarPresenter.setEnabled(enabled);
    if (enabled) {
      await this.addonEnabledClient.enable(tabId);
    } else {
      await this.addonEnabledClient.disable(tabId);
    }
  }

  async updateTabEnabled(tabId: number): Promise<void> {
    const enabled = this.addonEnabledRepository.isEnabled();
    if (enabled) {
      await this.addonEnabledClient.enable(tabId);
    } else {
      await this.addonEnabledClient.disable(tabId);
    }
  }
}
