import { injectable, inject } from "inversify";
import HintClient from "../clients/HintClient";
import type HintTarget from "./HintTarget";
import type HintAction from "./HintAction";
import type TabPresenter from "../presenters/TabPresenter";

@injectable()
export default class TabopenHintAction implements HintAction {
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

    await this.tabPresenter.openNewTab(href, tabId, opts.background);
  }
}
