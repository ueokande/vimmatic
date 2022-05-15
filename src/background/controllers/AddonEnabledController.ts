import { injectable } from "tsyringe";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";

@injectable()
export default class AddonEnabledController {
  constructor(private addonEnabledUseCase: AddonEnabledUseCase) {}

  indicate(enabled: boolean): Promise<void> {
    return this.addonEnabledUseCase.indicate(enabled);
  }
}
