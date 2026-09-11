import { injectable } from "inversify";
import * as urls from "../../shared/urls";

export interface BrowserSettingRepository {
  getHomepageUrls(): Promise<string[]>;
}

export const BrowserSettingRepository = Symbol("BrowserSettingRepository");

@injectable()
export class FirefoxBrowserSettingRepositoryImpl
  implements BrowserSettingRepository
{
  async getHomepageUrls(): Promise<string[]> {
    const { value } = await chrome.browserSettings.homepageOverride.get({});
    const normalizedURLs = value
      .split("|")
      .map((u) => u.trim())
      .filter((u) => u.length > 0)
      .map(urls.normalizeUrl)
      .filter(
        // firefox does not supports about:blank
        (u) => !u.startsWith("about:") || u === "about:blank",
      );
    if (normalizedURLs.length === 0) {
      return ["about:blank"];
    }
    return normalizedURLs;
  }
}

@injectable()
export class ChromeBrowserSettingRepositoryImpl
  implements BrowserSettingRepository
{
  async getHomepageUrls(): Promise<string[]> {
    // chrome does not supports browserSettings APIs
    return ["chrome://newtab"];
  }
}
