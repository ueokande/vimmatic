import { inject, injectable } from "inversify";
import { AddonEnabledUseCase } from "../usecases/AddonEnabledUseCase";

@injectable()
export class AddonEnabledController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
  ) {}

  async enable(): Promise<void> {
    this.addonEnabledUseCase.applyTabEnabled(true);
  }

  async disable(): Promise<void> {
    this.addonEnabledUseCase.applyTabEnabled(false);
  }
}
