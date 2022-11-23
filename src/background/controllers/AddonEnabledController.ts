import { injectable, inject } from "inversify";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class AddonEnabledController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  indicate(
    _ctx: RequestContext,
    { enabled }: { enabled: boolean }
  ): Promise<void> {
    return this.addonEnabledUseCase.indicate(enabled);
  }
}
