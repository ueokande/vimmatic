import { inject, injectable } from "inversify";
import MarkRepository from "../repositories/MarkRepository";
import ContentMessageClient from "../clients/ContentMessageClient";
import ConsoleClient from "../clients/ConsoleClient";
import GlobalMark from "../domains/GlobalMark";
import LocalMark from "../domains/LocalMark";
import MarkHelper from "./MarkHelper";
import RequestContext from "../infrastructures/RequestContext";

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

  async setMark(ctx: RequestContext, key: string): Promise<void> {
    const { tabId } = ctx.sender;
    if (typeof ctx.sender.tab.url === "undefined") {
      return;
    }
    const url = ctx.sender.tab.url;
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
    mark: GlobalMark
  ): Promise<void> {
    this.markRepository.setGlobalMark(key, mark);
    await this.consoleClient.showInfo(tabId, `Set global mark to '${key}'`);
  }

  private async setLocalMark(
    tabId: number,
    key: string,
    mark: LocalMark
  ): Promise<void> {
    this.markRepository.setLocalMark(tabId, key, mark);
    await this.consoleClient.showInfo(tabId, `Set local mark to '${key}'`);
  }
}
