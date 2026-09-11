import { injectable } from "inversify";

@injectable()
export class EventUseCaseHelper {
  async isSystemTab(tabId: number): Promise<boolean> {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url?.startsWith("https://") && tab.url.startsWith("http://")) {
      return false;
    }
    return true;
  }
}
