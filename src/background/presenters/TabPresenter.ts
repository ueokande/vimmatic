import { injectable } from "inversify";

export default interface TabPresenter {
  openToTab(url: string, tabId: number): Promise<void>;

  openNewTab(url: string, openerId: number, background: boolean): Promise<void>;
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
}