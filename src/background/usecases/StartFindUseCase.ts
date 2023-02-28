import { inject, injectable } from "inversify";
import ConsoleClient from "../clients/ConsoleClient";
import FindRepositoryImpl from "../repositories/FindRepository";
import FindClient from "../clients/FindClient";
import ReadyFrameRepository from "../repositories/ReadyFrameRepository";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class StartFindUseCase {
  constructor(
    @inject("FindClient")
    private readonly findClient: FindClient,
    @inject("FindRepository")
    private readonly findRepository: FindRepositoryImpl,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository
  ) {}

  async startFind(ctx: RequestContext, keyword?: string): Promise<void> {
    const { tabId } = ctx.sender;
    if (typeof keyword === "undefined") {
      keyword = this.findRepository.getLocalState(tabId)?.keyword;
    }
    if (typeof keyword === "undefined") {
      keyword = this.findRepository.getGlobalKeyword();
    }
    if (typeof keyword === "undefined") {
      await this.consoleClient.showError(tabId, "No previous search keywords");
      return;
    }

    this.findRepository.setGlobalKeyword(keyword);

    const frameIds = this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      // No frames are ready
      return;
    }
    for (const frameId of frameIds) {
      await this.findClient.clearSelection(tabId, frameId);
    }

    for (const frameId of frameIds) {
      const found = await this.findClient.findNext(tabId, frameId, keyword);
      if (found) {
        this.findRepository.setLocalState(tabId, {
          frameId,
          keyword,
        });
        await this.consoleClient.showInfo(tabId, "Pattern found: " + keyword);
        return;
      }
    }
    this.consoleClient.showError(tabId, "Pattern not found: " + keyword);
  }
}
