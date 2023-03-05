import { inject, injectable } from "inversify";
import ToolbarPresenter from "../presenters/ToolbarPresenter";
import AddonEnabledRepository from "../repositories/AddonEnabledRepository";

@injectable()
export default class AddonEnabledUseCase {
  constructor(
    @inject("ToolbarPresenter")
    private readonly toolbarPresenter: ToolbarPresenter,
    @inject("AddonEnabledRepository")
    private readonly addonEnabledRepository: AddonEnabledRepository
  ) {}

  async enable(): Promise<void> {
    this.addonEnabledRepository.enable();
    await this.toolbarPresenter.setEnabled(true);
  }

  async disable(): Promise<void> {
    this.addonEnabledRepository.disable();
    await this.toolbarPresenter.setEnabled(false);
  }

  async toggle(): Promise<void> {
    const newValue = this.addonEnabledRepository.toggle();
    await this.toolbarPresenter.setEnabled(newValue);
  }
}
