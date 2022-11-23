import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import BrowserSettingRepository from "../../repositories/BrowserSettingRepository";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class OpenHomeOperator implements Operator {
  constructor(
    @inject("BrowserSettingRepository")
    private readonly browserSettingRepository: BrowserSettingRepository
  ) {}

  name() {
    return "navigate.home";
  }

  schema() {
    return z.object({
      newTab: z.boolean().default(false),
    });
  }

  async run(
    _ctx: RequestContext,
    { newTab }: z.infer<ReturnType<OpenHomeOperator["schema"]>>
  ): Promise<void> {
    const urls = await this.browserSettingRepository.getHomepageUrls();
    if (urls.length === 1 && urls[0] === "about:home") {
      // eslint-disable-next-line max-len
      throw new Error(
        "Cannot open Firefox Home (about:home) by WebExtensions, set your custom URLs"
      );
    }
    if (urls.length === 1 && !newTab) {
      await browser.tabs.update({ url: urls[0] });
      return;
    }
    for (const url of urls) {
      await browser.tabs.create({ url });
    }
  }
}
