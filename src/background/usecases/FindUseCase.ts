import { inject, injectable } from "inversify";
import ConsoleClient from "../clients/ConsoleClient";
import FindRepository from "../repositories/FindRepository";
import FindHistoryRepository from "../repositories/FindHistoryRepository";

import FindClient from "../clients/FindClient";
import ReadyFrameRepository from "../repositories/ReadyFrameRepository";

@injectable()
export default class StartFindUseCase {
  constructor(
    @inject("FindClient")
    private readonly findClient: FindClient,
    @inject("FindRepository")
    private readonly findRepository: FindRepository,
    @inject("FindHistoryRepository")
    private readonly findHistoryRepository: FindHistoryRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository
  ) {}

  async startFind(tabId: number, keyword?: string): Promise<void> {
    if (typeof keyword === "undefined") {
      const state = await this.findRepository.getLocalState(tabId);
      keyword = state?.keyword;
    }
    if (typeof keyword === "undefined") {
      keyword = await this.findRepository.getGlobalKeyword();
    }
    if (typeof keyword === "undefined") {
      await this.consoleClient.showError(tabId, "No previous search keywords");
      return;
    }

    await this.findHistoryRepository.append(keyword);
    await this.findRepository.setGlobalKeyword(keyword);

    const frameIds = await this.frameRepository.getFrameIds(tabId);
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
        await this.findRepository.setLocalState(tabId, {
          frameId,
          keyword,
        });
        await this.consoleClient.showInfo(tabId, "Pattern found: " + keyword);
        return;
      }
    }
    this.consoleClient.showError(tabId, "Pattern not found: " + keyword);
  }

  async getHistories(prefix: string): Promise<string[]> {
    return this.findHistoryRepository.query(prefix);
  }
}
