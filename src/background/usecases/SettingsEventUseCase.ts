import { injectable, inject } from "inversify";
import ContentMessageClient from "../clients/ContentMessageClient";
import SettingsRepository from "../settings/SettingsRepository";
import EventUseCaseHelper from "./EventUseCaseHelper";

@injectable()
export default class SettingsUseCase {
  constructor(
    @inject("PermanentSettingsRepository")
    private readonly settingsRepository: SettingsRepository,
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject(EventUseCaseHelper)
    private readonly eventUseCaseHelper: EventUseCaseHelper
  ) {}

  registerEvents() {
    this.settingsRepository.onChanged(async () => {
      const [tab] = await chrome.tabs.query({
        currentWindow: true,
        active: true,
      });
      this.contentMessageClient.settingsChanged(tab.id!);
    });
    chrome.tabs.onActivated.addListener(async ({ tabId }) => {
      if (await this.eventUseCaseHelper.isSystemTab(tabId)) {
        return;
      }
      this.contentMessageClient.settingsChanged(tabId);
    });
  }
}
