import { injectable, inject } from "inversify";
import { AddonEnabledUseCase } from "../usecases/AddonEnabledUseCase";

@injectable()
export class AddonEnabledController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
  ) {}

  async enable(): Promise<void> {
    this.addonEnabledUseCase.enable();
  }

  async disable(): Promise<void> {
    this.addonEnabledUseCase.disable();
  }
}
