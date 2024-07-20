import { injectable, inject } from "inversify";
import type { HintClient } from "../clients/HintClient";
import type { HintTarget, HintAction } from "./types";
import type { TabPresenter } from "../presenters/TabPresenter";

@injectable()
export class OpenSourceHintAction implements HintAction {
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
    opts: {
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

    const url = "view-source:" + href;
    if (opts.newTab) {
      await this.tabPresenter.openNewTab(url, tabId, opts.background);
    } else {
      await this.tabPresenter.openToTab(url, tabId);
    }
  }
}
