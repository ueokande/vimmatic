import { injectable, inject } from "inversify";
import { HintClient } from "../clients/HintClient";
import type { HintTarget, HintAction } from "./types";
import { TabPresenter } from "../presenters/TabPresenter";

@injectable()
export class OpenImageHintAction implements HintAction {
  constructor(
    @inject(HintClient)
    private readonly hintClient: HintClient,
    @inject(TabPresenter)
    private readonly tabPresenter: TabPresenter,
  ) {}

  description(): string {
    return "Open image";
  }

  lookupTargetSelector(): string {
    return ["img"].join(",");
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

    const src = element.attributes["src"];
    if (!src) {
      return;
    }

    const pageUrl = await this.tabPresenter
      .getTab(tabId)
      .then((tab) => tab.url);
    const imgURL = new URL(src, pageUrl).href;

    if (opts.newTab) {
      this.tabPresenter.openNewTab(imgURL, tabId, opts.background);
    } else {
      this.tabPresenter.openToTab(imgURL, tabId);
    }
  }
}
