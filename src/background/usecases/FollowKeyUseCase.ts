import { injectable, inject } from "inversify";
import FollowClient from "../clients/FollowClient";
import FollowRepository from "../repositories/FollowRepository";

@injectable()
export default class FollowKeyUseCase {
  constructor(
    @inject("FollowClient")
    private readonly followClient: FollowClient,
    @inject("FollowRepository")
    private readonly followRepository: FollowRepository
  ) {}

  async pressKey(tabId: number, key: string): Promise<boolean> {
    switch (key) {
      case "Enter":
        await this.activate(tabId, await this.followRepository.getKeys());
        return false;
      case "Esc":
        return false;
      case "Backspace":
      case "Delete":
        await this.followRepository.popKey();
        await this.filter(tabId, await this.followRepository.getKeys());
        return true;
    }

    await this.followRepository.pushKey(key);

    const prefix = await this.followRepository.getKeys();
    const matched = await this.followRepository.getMatchedHints();
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
    const { newTab, background } = await this.followRepository.getOption();
    await this.followClient.activateIfExists(tabId, tag, newTab, background);
  }

  private async filter(tabId: number, prefix: string): Promise<void> {
    await this.followClient.filterHints(tabId, prefix);
  }
}
