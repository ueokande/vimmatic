import Operator from "../Operator";
import BrowserSettingRepository from "../../repositories/BrowserSettingRepository";

export default class OpenHomeOperator implements Operator {
  constructor(
    private readonly browserSettingRepository: BrowserSettingRepository,
    private readonly newTab: boolean
  ) {}

  async run(): Promise<void> {
    const urls = await this.browserSettingRepository.getHomepageUrls();
    if (urls.length === 1 && urls[0] === "about:home") {
      // eslint-disable-next-line max-len
      throw new Error(
        "Cannot open Firefox Home (about:home) by WebExtensions, set your custom URLs"
      );
    }
    if (urls.length === 1 && !this.newTab) {
      await browser.tabs.update({ url: urls[0] });
      return;
    }
    for (const url of urls) {
      await browser.tabs.create({ url });
    }
  }
}
