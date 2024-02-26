import { injectable } from "inversify";

export type Tab = chrome.tabs.Tab;

export interface TabPresenter {
  openToTab(url: string, tabId: number): Promise<void>;

  openNewTab(url: string, openerId: number, background: boolean): Promise<void>;

  openNewWindow(url: string): Promise<void>;

  getTab(tabId: number): Promise<Tab>;
}

@injectable()
export class TabPresenterImpl implements TabPresenter {
  async openToTab(url: string, tabId: number): Promise<void> {
    await chrome.tabs.update(tabId, { url });
  }

  async openNewTab(
    url: string,
    openerId: number,
    background: boolean,
  ): Promise<void> {
    const properties: any = { active: !background };

    const platform = await chrome.runtime.getPlatformInfo();
    if (platform.os !== "android") {
      // openerTabId not supported on Android
      properties.openerTabId = openerId;
    }

    await chrome.tabs.create({ url, ...properties });
  }

  async openNewWindow(url: string): Promise<void> {
    await chrome.windows.create({ url });
  }

  async getTab(tabId: number): Promise<Tab> {
    return await chrome.tabs.get(tabId);
  }
}
