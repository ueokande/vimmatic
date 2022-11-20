import { inject, injectable } from "inversify";
import IndicatorPresenter from "../presenters/IndicatorPresenter";
import ContentMessageClient from "../clients/ContentMessageClient";

@injectable()
export default class AddonEnabledUseCase {
  constructor(
    @inject(IndicatorPresenter)
    private readonly indicatorPresentor: IndicatorPresenter,
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient
  ) {
    this.indicatorPresentor.onClick((tab) => {
      if (tab.id) {
        this.onIndicatorClick(tab.id);
      }
    });
    browser.tabs.onActivated.addListener((info) =>
      this.onTabSelected(info.tabId)
    );
  }

  indicate(enabled: boolean): Promise<void> {
    return this.indicatorPresentor.indicate(enabled);
  }

  private onIndicatorClick(tabId: number): Promise<void> {
    return this.contentMessageClient.toggleAddonEnabled(tabId);
  }

  async onTabSelected(tabId: number): Promise<void> {
    const enabled = await this.contentMessageClient.getAddonEnabled(tabId);
    return this.indicatorPresentor.indicate(enabled);
  }
}
