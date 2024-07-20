import type { BrowserSettingRepository } from "../../../src/background/repositories/BrowserSettingRepository";

export class MockBrowserSettingRepository implements BrowserSettingRepository {
  constructor(private readonly homepageUrls: string[]) {}

  getHomepageUrls(): Promise<string[]> {
    return Promise.resolve(this.homepageUrls);
  }
}
