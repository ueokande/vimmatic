import { injectable, inject } from "inversify";
import type HintClient from "../clients/HintClient";
import type { HintTarget } from "../hint/types";
import type HintRepository from "../repositories/HintRepository";
import type HintActionFactory from "../hint/HintActionFactory";

@injectable()
export default class HintKeyUseCase {
  constructor(
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("HintRepository")
    private readonly hintRepository: HintRepository,
    @inject("HintActionFactory")
    private readonly hintActionFactory: HintActionFactory,
  ) {}

  async pressKey(tabId: number, key: string): Promise<boolean> {
    switch (key) {
      case "Enter": {
        const matched = await this.hintRepository.getAllMatchedHints();
        if (matched.length > 0) {
          await this.activate(tabId, matched[0]);
        }
        return false;
      }
      case "Esc":
        return false;
      case "Backspace":
      case "Delete":
        await this.hintRepository.popKey();
        await this.showOnlyMatched(tabId);
        return true;
    }

    await this.hintRepository.pushKey(key);

    const matched = await this.hintRepository.getAllMatchedHints();
    if (matched.length === 0) {
      return false;
    } else if (matched.length === 1) {
      await this.activate(tabId, matched[0]);
      return false;
    } else {
      await this.showOnlyMatched(tabId);
      return true;
    }
  }

  private async activate(tabId: number, target: HintTarget): Promise<void> {
    const hintMode = await this.hintRepository.getHintModeName();
    const hintOpts = await this.hintRepository.getOption();
    const hintAction = this.hintActionFactory.createHintAction(hintMode);

    await hintAction.activate(tabId, target, hintOpts);
  }

  private async showOnlyMatched(tabId: number): Promise<void> {
    const frameIds = await this.hintRepository.getTargetFrameIds();
    for (const frameId of frameIds) {
      const hints = await this.hintRepository.getMatchedHints(frameId);
      const elements = hints.map((hint) => hint.element);
      await this.hintClient.showHints(tabId, frameId, elements);
    }
  }
}
