import { inject, injectable } from "inversify";
import MarkRepository from "../repositories/MarkRepository";
import ContentMessageClient from "../clients/ContentMessageClient";
import ConsoleClient from "../clients/ConsoleClient";
import PropertySettings from "../settings/PropertySettings";
import MarkHelper from "./MarkHelper";

@injectable()
export default class MarkJumpUseCase {
  constructor(
    @inject("MarkRepository")
    private readonly markRepository: MarkRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings,
    @inject(MarkHelper)
    private readonly markHelper: MarkHelper
  ) {}

  async jumpToMark(key: string): Promise<void> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) {
      return;
    }
    if (this.markHelper.isGlobalKey(key)) {
      return this.jumpToGlobalMark(tab.id, key);
    } else {
      return this.jumpToLocalMark(tab.id, key);
    }
  }

  private async jumpToGlobalMark(tabId: number, key: string): Promise<void> {
    const mark = this.markRepository.getGlobalMark(key);
    if (!mark) {
      return this.consoleClient.showError(tabId, "Mark is not set");
    }
    const smooth = (await this.propertySettings.getProperty(
      "smoothscroll"
    )) as boolean;
    try {
      await this.contentMessageClient.scrollTo(
        mark.tabId,
        0,
        mark.x,
        mark.y,
        smooth
      );
      await chrome.tabs.update(tabId, { active: true });
      return;
    } catch (e) {
      const tab = await chrome.tabs.create({ url: mark.url });
      if (!tab.id) {
        return;
      }
      this.markRepository.setGlobalMark(key, {
        tabId: tab.id,
        url: mark.url,
        x: mark.x,
        y: mark.y,
      });
    }
  }

  private async jumpToLocalMark(tabId: number, key: string): Promise<void> {
    const mark = this.markRepository.getLocalMark(tabId, key);
    if (!mark) {
      return this.consoleClient.showError(tabId, "Mark is not set");
    }
    const smooth = (await this.propertySettings.getProperty(
      "smoothscroll"
    )) as boolean;
    await this.contentMessageClient.scrollTo(tabId, 0, mark.x, mark.y, smooth);
  }
}
