import { inject, injectable } from "inversify";
import Operator from "../Operator";
import FindRepository from "../../repositories/FindRepository";
import FindClient from "../../clients/FindClient";
import ConsoleClient from "../../clients/ConsoleClient";
import ReadyFrameRepository from "../../repositories/ReadyFrameRepository";

@injectable()
export default class FindPrevOperator implements Operator {
  constructor(
    @inject("FindRepository")
    private readonly findRepository: FindRepository,
    @inject("FindClient")
    private readonly findClient: FindClient,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository
  ) {}

  name(): string {
    return "find.prev";
  }

  schema() {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tab?.id;
    if (tabId == null) {
      return;
    }

    let frameIds = this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      // No frames are ready
      return;
    }
    frameIds = frameIds.slice(0).reverse();

    const state = this.findRepository.getLocalState(tabId);
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
          const found = await this.findClient.findPrev(
            tabId,
            frameId,
            state.keyword
          );
          if (found) {
            this.findRepository.setLocalState(tabId, {
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
          "Pattern not found: " + state.keyword
        );
        return;
      }
    }

    const keyword = this.findRepository.getGlobalKeyword();
    if (keyword) {
      for (const frameId of frameIds) {
        await this.findClient.clearSelection(tabId, frameId);
      }

      for (const frameId of frameIds) {
        const found = await this.findClient.findPrev(tabId, frameId, keyword);
        if (found) {
          this.findRepository.setLocalState(tabId, { frameId, keyword });
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
