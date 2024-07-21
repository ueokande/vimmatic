import { inject, injectable } from "inversify";
import {
  MarkRepository,
  type GlobalMark,
  type LocalMark,
} from "../repositories/MarkRepository";
import { ContentMessageClient } from "../clients/ContentMessageClient";
import { ConsoleClient } from "../clients/ConsoleClient";
import { MarkHelper } from "./MarkHelper";

@injectable()
export class MarkSetUseCase {
  constructor(
    @inject(MarkRepository)
    private readonly markRepository: MarkRepository,
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient,
    @inject(MarkHelper)
    private readonly markHelper: MarkHelper,
  ) {}

  async setMark(tab: chrome.tabs.Tab, key: string): Promise<void> {
    if (typeof tab.id === "undefined" || typeof tab.url === "undefined") {
      return;
    }
    const { id: tabId, url } = tab;
    const { x, y } = await this.contentMessageClient.getScroll(tabId, 0);
    if (this.markHelper.isGlobalKey(key)) {
      const mark: GlobalMark = { tabId, url, x, y };
      return this.setGlobalMark(tabId, key, mark);
    } else {
      const mark: LocalMark = { x, y };
      return this.setLocalMark(tabId, key, mark);
    }
  }

  private async setGlobalMark(
    tabId: number,
    key: string,
    mark: GlobalMark,
  ): Promise<void> {
    await this.markRepository.setGlobalMark(key, mark);
    await this.consoleClient.showInfo(tabId, `Set global mark to '${key}'`);
  }

  private async setLocalMark(
    tabId: number,
    key: string,
    mark: LocalMark,
  ): Promise<void> {
    await this.markRepository.setLocalMark(tabId, key, mark);
    await this.consoleClient.showInfo(tabId, `Set local mark to '${key}'`);
  }
}
