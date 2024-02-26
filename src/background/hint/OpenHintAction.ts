import { injectable, inject } from "inversify";
import type { HintClient } from "../clients/HintClient";
import type { HintTarget, HintAction } from "./types";
import type { TabPresenter } from "../presenters/TabPresenter";

@injectable()
export default class OpenHintAction implements HintAction {
  constructor(
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
  ) {}

  lookupTargetSelector(): string {
    return ["a", "area"].join(",");
  }

  async activate(
    tabId: number,
    target: HintTarget,
    _opts: {
      newTab: boolean;
      background: boolean;
    },
  ): Promise<void> {
    const element = await this.hintClient.getElement(
      tabId,
      target.frameId,
      target.element,
    );
    if (!element) {
      return;
    }

    const href = element.href;
    if (!href) {
      return;
    }

    await this.tabPresenter.openToTab(href, tabId);
  }
}
