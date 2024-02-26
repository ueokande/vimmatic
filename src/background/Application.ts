import { injectable, inject } from "inversify";
import BackgroundMessageListener from "./messaging/BackgroundMessageListener";
import FindPortListener from "./messaging/FindPortListener";
import VersionUseCase from "./usecases/VersionUseCase";
import type { FindRepository } from "./repositories/FindRepository";
import type { ReadyFrameRepository } from "./repositories/ReadyFrameRepository";
import SettingsEventUseCase from "./usecases/SettingsEventUseCase";
import type { FrameClient } from "./clients/FrameClient";
import AddonEnabledEventUseCase from "./usecases/AddonEnabledEventUseCase";
import type { LastSelectedTabRepository } from "./repositories/LastSelectedTabRepository";
import ModeUseCase from "./usecases/ModeUseCase";
import HintModeUseCase from "./usecases/HintModeUseCase";

@injectable()
export default class Application {
  constructor(
    @inject(BackgroundMessageListener)
    private readonly backgroundMessageListener: BackgroundMessageListener,
    @inject(VersionUseCase)
    private readonly versionUseCase: VersionUseCase,
    @inject("FindRepository")
    private readonly findRepository: FindRepository,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository,
    @inject("LastSelectedTabRepository")
    private readonly lastSelectedTabRepository: LastSelectedTabRepository,
    @inject(SettingsEventUseCase)
    private readonly settingsEventUseCase: SettingsEventUseCase,
    @inject("FrameClient")
    private readonly frameClient: FrameClient,
    @inject(AddonEnabledEventUseCase)
    private readonly addonEnabledEventUseCase: AddonEnabledEventUseCase,
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
    @inject(HintModeUseCase)
    private readonly hintModeUseCase: HintModeUseCase,
  ) {}

  private readonly findPortListener = new FindPortListener(
    this.onFindPortConnect.bind(this),
    this.onFindPortDisconnect.bind(this),
  );

  run() {
    this.settingsEventUseCase.registerEvents();
    this.addonEnabledEventUseCase.registerEvents();

    chrome.tabs.onUpdated.addListener(async (tabId: number, info) => {
      if (info.status == "complete") {
        await this.modeUseCase.resetMode(tabId);
        await this.hintModeUseCase.stop(tabId);
      }

      if (info.status == "loading") {
        await this.findRepository.deleteLocalState(tabId);
      }
    });
    chrome.runtime.onStartup.addListener(() => {
      chrome.storage.local.clear();
    });
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install" && details.reason !== "update") {
        return;
      }
      this.versionUseCase.notify();
    });
    chrome.tabs.onActivated.addListener(({ tabId }) => {
      this.lastSelectedTabRepository.setCurrentTabId(tabId);
      const lastTabId = this.lastSelectedTabRepository.getLastSelectedTabId();
      if (typeof lastTabId !== "undefined") {
        this.modeUseCase.resetMode(tabId);
        this.hintModeUseCase.stop(tabId);
      }
    });

    this.backgroundMessageListener.listen();
    this.findPortListener.run();
  }

  private async onFindPortConnect(port: chrome.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (
      typeof tabId === "undefined" ||
      typeof frameId === "undefined" ||
      port.sender?.url === "about:blank"
    ) {
      return;
    }

    await this.frameClient.notifyFrameId(tabId, frameId);
    await this.frameRepository.addFrameId(tabId, frameId);
  }

  private async onFindPortDisconnect(port: chrome.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }

    await this.frameRepository.removeFrameId(tabId, frameId);
  }
}
