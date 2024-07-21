import { inject, injectable } from "inversify";
import { ToolbarPresenter } from "../presenters/ToolbarPresenter";
import { AddonEnabledUseCase } from "./AddonEnabledUseCase";
import { AddonEnabledRepository } from "../repositories/AddonEnabledRepository";
import { AddonEnabledClient } from "../clients/AddonEnabledClient";
import { EventUseCaseHelper } from "./EventUseCaseHelper";

@injectable()
export class AddonEnabledEventUseCase {
  constructor(
    @inject(ToolbarPresenter)
    private readonly toolbarPresenter: ToolbarPresenter,
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
    @inject(AddonEnabledRepository)
    private readonly addonEnabledRepository: AddonEnabledRepository,
    @inject(AddonEnabledClient)
    private readonly addonEnabledClient: AddonEnabledClient,
    @inject(EventUseCaseHelper)
    private readonly eventUseCaseHelper: EventUseCaseHelper,
  ) {}

  registerEvents() {
    this.addonEnabledRepository.onChange(async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (typeof tab.id === "undefined") {
        return;
      }
      this.syncTabEnabled(tab.id);
    });
    this.toolbarPresenter.onClick((tab: chrome.tabs.Tab) => {
      if (typeof tab.id === "undefined") {
        return;
      }
      return this.addonEnabledUseCase.toggle();
    });
    chrome.tabs.onActivated.addListener(async (info) => {
      if (await this.eventUseCaseHelper.isSystemTab(info.tabId)) {
        return;
      }
      this.syncTabEnabled(info.tabId);
    });
  }

  private async syncTabEnabled(tabId: number): Promise<void> {
    const enabled = await this.addonEnabledRepository.isEnabled();
    if (enabled) {
      await this.addonEnabledClient.enable(tabId);
    } else {
      await this.addonEnabledClient.disable(tabId);
    }
  }
}
