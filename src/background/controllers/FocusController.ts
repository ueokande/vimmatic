import { inject, injectable } from "inversify";
import type { RequestContext } from "../messaging/types";
import { FocusStateUseCase } from "../usecases/FocusStateUseCase";

@injectable()
export class FocusController {
  constructor(
    @inject(FocusStateUseCase)
    private readonly focusStateUseCase: FocusStateUseCase,
  ) {}

  async changeFocusState(
    { sender }: RequestContext,
    { focused }: { focused: boolean },
  ) {
    const tabId = sender.tab?.id;
    const frameId = sender.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }
    await this.focusStateUseCase.notifyFocusChanged(tabId, frameId, focused);
  }
}
