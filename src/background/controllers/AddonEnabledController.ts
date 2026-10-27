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
      // Not awaited so that page key handling is not delayed by the icon
      // update, which loads settings and calls the browser action API.
      this.addonEnabledUseCase
        .refreshIndicator(tabId, ctx.sender.url)
        .catch((e) => {
          // biome-ignore lint/suspicious/noConsole: intentional debug logging
          console.warn(e);
        });
    }
    const enabled = await this.addonEnabledUseCase.isEnabled(tabId);
    return { enabled };
  }
}
