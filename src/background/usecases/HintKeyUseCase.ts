import { injectable, inject } from "inversify";
import HintClient from "../clients/HintClient";
import HintRepository from "../repositories/HintRepository";

@injectable()
export default class HintKeyUseCase {
  constructor(
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("HintRepository")
    private readonly hintRepository: HintRepository,
  ) {}

  async pressKey(tabId: number, key: string): Promise<boolean> {
    switch (key) {
      case "Enter":
        await this.activate(tabId, await this.hintRepository.getKeys());
        return false;
      case "Esc":
        return false;
      case "Backspace":
      case "Delete":
        await this.hintRepository.popKey();
        await this.filter(tabId, await this.hintRepository.getKeys());
        return true;
    }

    await this.hintRepository.pushKey(key);

    const prefix = await this.hintRepository.getKeys();
    const matched = await this.hintRepository.getMatchedHints();
    if (matched.length === 0) {
      return false;
    } else if (matched.length === 1) {
      await this.activate(tabId, prefix);
      return false;
    } else {
      await this.filter(tabId, prefix);
      return true;
    }
  }

  private async activate(tabId: number, tag: string): Promise<void> {
    const { newTab, background } = await this.hintRepository.getOption();
    await this.hintClient.activateIfExists(tabId, tag, newTab, background);
  }

  private async filter(tabId: number, prefix: string): Promise<void> {
    await this.hintClient.filterHints(tabId, prefix);
  }
}
