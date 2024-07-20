import { injectable, inject } from "inversify";
import type { AddonEnabledRepository } from "../repositories/AddonEnabledRepository";
import type { ConsoleFramePresenter } from "../presenters/ConsoleFramePresenter";

@injectable()
export class AddonEnabledUseCase {
  constructor(
    @inject("AddonEnabledRepository")
    private readonly addonEnabledRepository: AddonEnabledRepository,
    @inject("ConsoleFramePresenter")
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
