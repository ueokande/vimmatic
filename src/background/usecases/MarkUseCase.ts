import { inject, injectable } from "inversify";
import MarkRepository from "../repositories/MarkRepository";
import ContentMessageClient from "../clients/ContentMessageClient";
import ConsoleClient from "../clients/ConsoleClient";

@injectable()
export default class MarkUseCase {
  constructor(
    @inject(MarkRepository)
    private readonly markRepository: MarkRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient
  ) {}

  async setGlobal(key: string, x: number, y: number): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const mark = { tabId: tab.id as number, url: tab.url as string, x, y };
    return this.markRepository.setMark(key, mark);
  }

  async jumpGlobal(key: string): Promise<void> {
    const [current] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!current.id) {
      return;
    }
    const mark = await this.markRepository.getMark(key);
    if (!mark) {
      return this.consoleClient.showError(current.id, "Mark is not set");
    }
    try {
      await this.contentMessageClient.scrollTo(mark.tabId, mark.x, mark.y);
      await browser.tabs.update(current.id, { active: true });
      return;
    } catch (e) {
      const tab = await browser.tabs.create({ url: mark.url });
      return this.markRepository.setMark(key, {
        tabId: tab.id as number,
        url: mark.url,
        x: mark.x,
        y: mark.y,
      });
    }
  }
}
