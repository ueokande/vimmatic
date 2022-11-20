import { injectable } from "inversify";

@injectable()
export default class LinkUseCase {
  async openToTab(url: string, tabId: number): Promise<void> {
    await browser.tabs.update(tabId, { url });
  }

  async openNewTab(
    url: string,
    openerId: number,
    background: boolean
  ): Promise<void> {
    const properties: any = { active: !background };

    const platform = await browser.runtime.getPlatformInfo();
    if (platform.os !== "android") {
      // openerTabId not supported on Android
      properties.openerTabId = openerId;
    }

    await browser.tabs.create({ url, ...properties });
  }
}
