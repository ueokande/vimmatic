import { injectable, inject } from "inversify";
import { HintClient } from "../clients/HintClient";
import type { HintTarget, HintAction } from "./types";
import { TabPresenter } from "../presenters/TabPresenter";

@injectable()
export class TabopenHintAction implements HintAction {
  constructor(
    @inject(HintClient)
    private readonly hintClient: HintClient,
    @inject(TabPresenter)
    private readonly tabPresenter: TabPresenter,
  ) {}

  description(): string {
    return "Open link";
  }

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

    await this.tabPresenter.openNewTab(href, tabId, opts.background);
  }
}
