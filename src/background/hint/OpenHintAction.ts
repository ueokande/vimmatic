import { inject, injectable } from "inversify";
import { HintClient } from "../clients/HintClient";
import { TabPresenter } from "../presenters/TabPresenter";
import type { HintAction, HintTarget } from "./types";

@injectable()
export class OpenHintAction implements HintAction {
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
