import { inject, injectable } from "inversify";
import ConsoleClient from "../clients/ConsoleClient";
import FindRepository from "../repositories/FindRepository";
import FindHistoryRepository from "../repositories/FindHistoryRepository";
import type PropertySettings from "../settings/PropertySettings";
import FindClient from "../clients/FindClient";
import ReadyFrameRepository from "../repositories/ReadyFrameRepository";

@injectable()
export default class FindUseCase {
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
    private readonly frameRepository: ReadyFrameRepository,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings,
  ) {}

  async startFind(tabId: number, keyword?: string): Promise<void> {
    if (typeof keyword === "undefined" || keyword === "") {
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

    const mode: "normal" | "regexp" =
      (await this.propertySettings.getProperty("findmode")) === "normal"
        ? "normal"
        : "regexp";
    const ignoreCase = Boolean(
      await this.propertySettings.getProperty("ignorecase"),
    );
    const query = { keyword, mode, ignoreCase };

    for (const frameId of frameIds) {
      const found = await this.findClient.findNext(tabId, frameId, query);
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

  async findNext(tabId: number): Promise<void> {
    const frameIds = await this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      // No frames are ready
      return;
    }

    const mode: "normal" | "regexp" =
      (await this.propertySettings.getProperty("findmode")) === "normal"
        ? "normal"
        : "regexp";
    const ignoreCase = Boolean(
      await this.propertySettings.getProperty("ignorecase"),
    );

    const state = await this.findRepository.getLocalState(tabId);
    if (state) {
      const framePos = frameIds.indexOf(state.frameId);
      if (framePos !== -1) {
        // Start to find the keyword from the current frame which last found on,
        // and concat it to end of frame ids to perform a wrap-search
        //
        //                ,- keyword should be in this frame
        //                |
        // [100, 101, 0, 100]
        //   |
        //   `- continue from frame id 100
        //
        const targetFrameIds = frameIds
          .slice(framePos)
          .concat(frameIds.slice(0, framePos), frameIds[framePos]);

        for (const frameId of targetFrameIds) {
          const found = await this.findClient.findNext(tabId, frameId, {
            keyword: state.keyword,
            mode,
            ignoreCase,
          });
          if (found) {
            await this.findRepository.setLocalState(tabId, {
              keyword: state.keyword,
              frameId,
            });
            return;
          }
          this.findClient.clearSelection(tabId, frameId);
        }

        // The keyword is gone.
        this.consoleClient.showError(
          tabId,
          "Pattern not found: " + state.keyword,
        );
        return;
      }
    }

    const keyword = await this.findRepository.getGlobalKeyword();
    if (keyword) {
      for (const frameId of frameIds) {
        await this.findClient.clearSelection(tabId, frameId);
      }

      for (const frameId of frameIds) {
        const found = await this.findClient.findNext(tabId, frameId, {
          keyword,
          mode,
          ignoreCase,
        });
        if (found) {
          await this.findRepository.setLocalState(tabId, { frameId, keyword });
          await this.consoleClient.showInfo(tabId, "Pattern found: " + keyword);
          return;
        }
      }
      this.consoleClient.showError(tabId, "Pattern not found: " + keyword);
      return;
    }
    await this.consoleClient.showError(tabId, "No previous search keywords");
  }

  async findPrev(tabId: number): Promise<void> {
    let frameIds = await this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      // No frames are ready
      return;
    }
    frameIds = frameIds.slice(0).reverse();

    const mode: "normal" | "regexp" =
      (await this.propertySettings.getProperty("findmode")) === "normal"
        ? "normal"
        : "regexp";
    const ignoreCase = Boolean(
      await this.propertySettings.getProperty("ignorecase"),
    );

    const state = await this.findRepository.getLocalState(tabId);
    if (state) {
      const framePos = frameIds.indexOf(state.frameId);
      if (framePos !== -1) {
        // Start to find the keyword from the current frame which last found on,
        // and concat it to end of frame ids to perform a wrap-search
        //
        //                ,- keyword should be in this frame
        //                |
        // [100, 101, 0, 100]
        //   |
        //   `- continue from frame id 100
        //
        const targetFrameIds = frameIds
          .slice(framePos)
          .concat(frameIds.slice(0, framePos), frameIds[framePos]);

        for (const frameId of targetFrameIds) {
          const found = await this.findClient.findPrev(tabId, frameId, {
            keyword: state.keyword,
            mode,
            ignoreCase,
          });
          if (found) {
            await this.findRepository.setLocalState(tabId, {
              keyword: state.keyword,
              frameId,
            });
            return;
          }
          this.findClient.clearSelection(tabId, frameId);
        }

        // The keyword is gone.
        this.consoleClient.showError(
          tabId,
          "Pattern not found: " + state.keyword,
        );
        return;
      }
    }

    const keyword = await this.findRepository.getGlobalKeyword();
    if (keyword) {
      for (const frameId of frameIds) {
        await this.findClient.clearSelection(tabId, frameId);
      }

      for (const frameId of frameIds) {
        const found = await this.findClient.findPrev(tabId, frameId, {
          keyword,
          mode,
          ignoreCase,
        });
        if (found) {
          await this.findRepository.setLocalState(tabId, { frameId, keyword });
          await this.consoleClient.showInfo(tabId, "Pattern found: " + keyword);
          return;
        }
      }
      this.consoleClient.showError(tabId, "Pattern not found: " + keyword);
      return;
    }
    await this.consoleClient.showError(tabId, "No previous search keywords");
  }
}
