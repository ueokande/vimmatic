import { injectable, inject } from "inversify";
import BackgroundMessageListener from "./infrastructures/BackgroundMessageListener";
import FindPortListener from "./infrastructures/FindPortListener";
import VersionUseCase from "./usecases/VersionUseCase";
import FindRepositoryImpl from "./repositories/FindRepository";
import ReadyFrameRepository from "./repositories/ReadyFrameRepository";
import SettingsEventUseCase from "./usecases/SettingsEventUseCase";
import FrameClient from "./clients/FrameClient";
import AddonEnabledEventUseCase from "./usecases/AddonEnabledEventUseCase";

@injectable()
export default class Application {
  constructor(
    @inject(BackgroundMessageListener)
    private readonly backgroundMessageListener: BackgroundMessageListener,
    @inject(VersionUseCase)
    private readonly versionUseCase: VersionUseCase,
    @inject("FindRepository")
    private readonly findRepository: FindRepositoryImpl,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository,
    @inject(SettingsEventUseCase)
    private readonly settingsEventUseCase: SettingsEventUseCase,
    @inject("FrameClient")
    private readonly frameClient: FrameClient,
    @inject(AddonEnabledEventUseCase)
    private readonly addonEnabledEventUseCase: AddonEnabledEventUseCase
  ) {}

  private readonly findPortListener = new FindPortListener(
    this.onFindPortConnect.bind(this),
    this.onFindPortDisconnect.bind(this)
  );

  run() {
    this.settingsEventUseCase.registerEvents();
    this.addonEnabledEventUseCase.registerEvents();

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
