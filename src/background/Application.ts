import { injectable, inject } from "inversify";
import ContentMessageClient from "./clients/ContentMessageClient";
import BackgroundMessageListener from "./infrastructures/BackgroundMessageListener";
import FindPortListener from "./infrastructures/FindPortListener";
import VersionUseCase from "./usecases/VersionUseCase";
import FindRepositoryImpl from "./repositories/FindRepository";
import ReadyFrameRepository from "./repositories/ReadyFrameRepository";
import SettingsRepository from "./settings/SettingsRepository";
import FrameClient from "./clients/FrameClient";
import ToolbarPresenter from "./presenters/ToolbarPresenter";
import AddonEnabledUseCase from "./usecases/AddonEnabledUseCase";

@injectable()
export default class Application {
  constructor(
    @inject(BackgroundMessageListener)
    private readonly backgroundMessageListener: BackgroundMessageListener,
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject(VersionUseCase)
    private readonly versionUseCase: VersionUseCase,
    @inject("FindRepository")
    private readonly findRepository: FindRepositoryImpl,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository,
    @inject("SettingsRepository")
    private readonly settingsRepository: SettingsRepository,
    @inject("FrameClient")
    private readonly frameClient: FrameClient,
    @inject("ToolbarPresenter")
    private readonly toolbarPresenter: ToolbarPresenter,
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  private readonly findPortListener = new FindPortListener(
    this.onFindPortConnect.bind(this),
    this.onFindPortDisconnect.bind(this)
  );

  run() {
    this.settingsRepository.onChanged(async () => {
      const [tab] = await chrome.tabs.query({
        currentWindow: true,
        active: true,
      });
      this.contentMessageClient.settingsChanged(tab.id!);
    });
    chrome.tabs.onActivated.addListener(({ tabId }) => {
      this.contentMessageClient.settingsChanged(tabId);
    });
    chrome.tabs.onUpdated.addListener((tabId: number, info) => {
      if (info.status == "loading") {
        this.findRepository.deleteLocalState(tabId);
      }
    });
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install" && details.reason !== "update") {
        return;
      }
      this.versionUseCase.notify();
    });

    this.backgroundMessageListener.listen();
    this.findPortListener.run();

    this.toolbarPresenter.onClick((tab: chrome.tabs.Tab) => {
      if (typeof tab.id === "undefined") {
        return;
      }
      return this.addonEnabledUseCase.toggle(tab.id);
    });
    chrome.tabs.onActivated.addListener((info) =>
      this.addonEnabledUseCase.updateTabEnabled(info.tabId)
    );
  }

  private onFindPortConnect(port: chrome.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }

    this.frameClient.notifyFrameId(tabId, frameId);
    this.frameRepository.addFrameId(tabId, frameId);
  }

  private onFindPortDisconnect(port: chrome.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }

    this.frameRepository.removeFrameId(tabId, frameId);
  }
}
