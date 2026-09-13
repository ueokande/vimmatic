import { inject, injectable } from "inversify";
import { ConsoleFramePresenter } from "../presenters/ConsoleFramePresenter";
import { AddonEnabledRepository } from "../repositories/AddonEnabledRepository";

@injectable()
export class AddonEnabledUseCase {
  constructor(
    @inject(AddonEnabledRepository)
    private readonly addonEnabledRepository: AddonEnabledRepository,
    @inject(ConsoleFramePresenter)
    private readonly consoleFramePresenter: ConsoleFramePresenter,
  ) {}

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
