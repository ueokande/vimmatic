import { injectable, inject } from "inversify";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";

@injectable()
export default class AddonEnabledController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  indicate(enabled: boolean): Promise<void> {
    return this.addonEnabledUseCase.indicate(enabled);
  }
}
