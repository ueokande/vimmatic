import { injectable, inject } from "inversify";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";

@injectable()
export default class AddonEnabledController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  toggleAddonEnabled(): Promise<void> {
    this.addonEnabledUseCase.toggle();
    return Promise.resolve();
  }

  getAddonEnabled(): Promise<boolean> {
    const enabled = this.addonEnabledUseCase.getEnabled();
    return Promise.resolve(enabled);
  }
}
