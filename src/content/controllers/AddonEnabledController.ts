import { injectable, inject } from "inversify";
import * as messages from "../../shared/messages";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";

@injectable()
export default class AddonEnabledController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  getAddonEnabled(
    _message: messages.AddonEnabledQueryMessage
  ): Promise<boolean> {
    const enabled = this.addonEnabledUseCase.getEnabled();
    return Promise.resolve(enabled);
  }
}
