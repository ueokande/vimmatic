import { inject, injectable } from "inversify";
import { ToolbarPresenter } from "../presenters/ToolbarPresenter";
import type { SettingsRepository } from "../settings/SettingsRepository";
import { PermanentSettingsRepository } from "../settings/SettingsRepository";
import { AddonEnabledUseCase } from "./AddonEnabledUseCase";

@injectable()
export class AddonEnabledEventUseCase {
  constructor(
    @inject(ToolbarPresenter)
    private readonly toolbarPresenter: ToolbarPresenter,
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
    @inject(PermanentSettingsRepository)
    private readonly settingsRepository: SettingsRepository,
  ) {}

  registerEvents() {
    this.toolbarPresenter.onClick((tab: chrome.tabs.Tab) => {
      if (typeof tab.id === "undefined") {
        return;
      }
      return this.addonEnabledUseCase.toggle(tab.id);
    });
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.addonEnabledUseCase.clear(tabId);
    });
    this.settingsRepository.onChanged(async () => {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (typeof tab.id === "undefined") {
          continue;
        }
        this.addonEnabledUseCase.refreshIndicator(tab.id, tab.url);
      }
    });
  }
}
