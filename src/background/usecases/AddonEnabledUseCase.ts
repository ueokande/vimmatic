import { inject, injectable } from "inversify";
import { AddonEnabledClient } from "../clients/AddonEnabledClient";
import { TabPresenter } from "../presenters/TabPresenter";
import { ToolbarPresenter } from "../presenters/ToolbarPresenter";
import { AddonEnabledRepository } from "../repositories/AddonEnabledRepository";
import type { SettingsRepository } from "../settings/SettingsRepository";
import { PermanentSettingsRepository } from "../settings/SettingsRepository";

@injectable()
export class AddonEnabledUseCase {
  constructor(
    @inject(ToolbarPresenter)
    private readonly toolbarPresenter: ToolbarPresenter,
    @inject(AddonEnabledRepository)
    private readonly addonEnabledRepository: AddonEnabledRepository,
    @inject(AddonEnabledClient)
    private readonly addonEnabledClient: AddonEnabledClient,
    @inject(TabPresenter)
    private readonly tabPresenter: TabPresenter,
    @inject(PermanentSettingsRepository)
    private readonly settingsRepository: SettingsRepository,
  ) {}

  isEnabled(tabId: number): Promise<boolean> {
    return this.addonEnabledRepository.isEnabled(tabId);
  }

  async enable(tabId: number): Promise<void> {
    await this.addonEnabledRepository.setEnabled(tabId, true);
    await this.apply(tabId, true);
  }

  async disable(tabId: number): Promise<void> {
    await this.addonEnabledRepository.setEnabled(tabId, false);
    await this.apply(tabId, false);
  }

  async toggle(tabId: number): Promise<void> {
    const enabled = await this.addonEnabledRepository.toggle(tabId);
    await this.apply(tabId, enabled);
  }

  async clear(tabId: number): Promise<void> {
    await this.addonEnabledRepository.delete(tabId);
  }

  // The tab URL is passed by callers that already know it, because
  // chrome.tabs.get() may still return the previous URL while a page loads.
  async refreshIndicator(tabId: number, url?: string): Promise<void> {
    const enabled = await this.addonEnabledRepository.isEnabled(tabId);
    const pageUrl = url ?? (await this.tabPresenter.getTab(tabId)).url;
    const blacklisted = await this.isBlacklisted(pageUrl);
    await this.toolbarPresenter.setEnabled(tabId, enabled && !blacklisted);
  }

  private async apply(tabId: number, enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        await this.addonEnabledClient.enable(tabId);
      } else {
        await this.addonEnabledClient.disable(tabId);
      }
    } catch (e) {
      // The tab may have no content script (e.g. a privileged page); the
      // state is still stored and applied when the page is loaded.
      // biome-ignore lint/suspicious/noConsole: intentional debug logging
      console.warn(e);
    }
    await this.refreshIndicator(tabId);
  }

  private async isBlacklisted(url: string | undefined): Promise<boolean> {
    if (!url) {
      return false;
    }
    let u: URL;
    try {
      u = new URL(url);
    } catch {
      return false;
    }
    const settings = await this.settingsRepository.load();
    return settings.blacklist?.includesEntireBlacklist(u) ?? false;
  }
}
