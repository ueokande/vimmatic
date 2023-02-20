import { inject, injectable } from "inversify";
import MarkRepository from "../repositories/MarkRepository";
import ContentMessageClient from "../clients/ContentMessageClient";
import ConsoleClient from "../clients/ConsoleClient";
import GlobalMark from "../domains/GlobalMark";
import LocalMark from "../domains/LocalMark";
import MarkHelper from "./MarkHelper";

@injectable()
export default class MarkSetUseCase {
  constructor(
    @inject("MarkRepository")
    private readonly markRepository: MarkRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject(MarkHelper)
    private readonly markHelper: MarkHelper
  ) {}

  async setMark(key: string): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id || !tab.url) {
      return;
    }
    const { x, y } = await this.contentMessageClient.getScroll(tab.id);
    if (this.markHelper.isGlobalKey(key)) {
      const mark: GlobalMark = { tabId: tab.id, url: tab.url, x, y };
      return this.setGlobalMark(tab.id, key, mark);
    } else {
      const mark: LocalMark = { x, y };
      return this.setLocalMark(tab.id, key, mark);
    }
  }

  private async setGlobalMark(
    tabId: number,
    key: string,
    mark: GlobalMark
  ): Promise<void> {
    await this.markRepository.setGlobalMark(key, mark);
    await this.consoleClient.showInfo(tabId, `Set global mark to '${key}'`);
  }

  private async setLocalMark(
    tabId: number,
    key: string,
    mark: LocalMark
  ): Promise<void> {
    await this.markRepository.setLocalMark(tabId, key, mark);
    await this.consoleClient.showInfo(tabId, `Set local mark to '${key}'`);
  }
}
