import { inject, injectable } from "inversify";
import type { RequestContext } from "../messaging/types";
import { AddonEnabledUseCase } from "../usecases/AddonEnabledUseCase";

@injectable()
export class AddonEnabledController {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
  ) {}

  async getEnabled(ctx: RequestContext): Promise<{ enabled: boolean }> {
    const tabId = ctx.sender.tab?.id;
    if (typeof tabId === "undefined") {
      return { enabled: true };
    }
    if (ctx.sender.frameId === 0) {
      await this.addonEnabledUseCase.refreshIndicator(tabId, ctx.sender.url);
    }
    const enabled = await this.addonEnabledUseCase.isEnabled(tabId);
    return { enabled };
  }
}
