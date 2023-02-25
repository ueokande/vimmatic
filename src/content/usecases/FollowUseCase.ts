import { injectable, inject } from "inversify";
import FollowPresenter from "../presenters/FollowPresenter";
import { LinkHint, InputHint } from "../presenters/Hint";
import TabsClient from "../client/TabsClient";

@injectable()
export default class FollowUseCase {
  constructor(
    @inject("FollowPresenter")
    private readonly presenter: FollowPresenter,
    @inject("TabsClient")
    private readonly tabsClient: TabsClient
  ) {}

  async countHints(
    viewSize: { width: number; height: number },
    framePosition: { x: number; y: number }
  ): Promise<number> {
    return this.presenter.getTargetCount(viewSize, framePosition);
  }

  async createHints(
    viewSize: { width: number; height: number },
    framePosition: { x: number; y: number },
    hints: string[]
  ) {
    return this.presenter.createHints(viewSize, framePosition, hints);
  }

  async filterHints(prefix: string): Promise<void> {
    return this.presenter.filterHints(prefix);
  }

  async remove(): Promise<void> {
    return this.presenter.clearHints();
  }

  async activateIfExists(tag: string, newTab: boolean, background: boolean) {
    console.log("activate", tag);
    const hint = this.presenter.getHint(tag);
    if (!hint) {
      return;
    }

    if (hint instanceof LinkHint) {
      const url = hint.getLink();
      let openNewTab = newTab;
      // Open link by background script in order to prevent a popup block
      if (hint.getLinkTarget() === "_blank") {
        openNewTab = true;
      }
      // eslint-disable-next-line no-script-url
      if (!url || url === "#" || url.toLowerCase().startsWith("javascript:")) {
        hint.click();
        return;
      }
      await this.tabsClient.openUrl(url, openNewTab, background);
    } else if (hint instanceof InputHint) {
      hint.activate();
    }
  }
}
