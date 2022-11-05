import { injectable, inject } from "inversify";
import ContentMessageClient from "./infrastructures/ContentMessageClient";
import ContentMessageListener from "./infrastructures/ContentMessageListener";
import FindPortListener from "./infrastructures/FindPortListener";
import VersionController from "./controllers/VersionController";
import FindRepositoryImpl from "./repositories/FindRepository";
import ReadyFrameRepository from "./repositories/ReadyFrameRepository";
import SettingsRepository from "./settings/SettingsRepository";

@injectable()
export default class Application {
  constructor(
    @inject(ContentMessageListener)
    private readonly contentMessageListener: ContentMessageListener,
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient,
    @inject(VersionController)
    private readonly versionController: VersionController,
    @inject("FindRepository")
    private readonly findRepository: FindRepositoryImpl,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository,
    @inject("SettingsRepository")
    private readonly settingsRepository: SettingsRepository
  ) {}

  private readonly findPortListener = new FindPortListener(
    this.onFindPortConnect.bind(this),
    this.onFindPortDisconnect.bind(this)
  );

  run() {
    this.settingsRepository.onChanged(async () => {
      const [tab] = await browser.tabs.query({
        currentWindow: true,
        active: true,
      });
      this.contentMessageClient.settingsChanged(tab.id!);
    });
    browser.tabs.onActivated.addListener(({ tabId }) => {
      this.contentMessageClient.settingsChanged(tabId);
    });
    browser.tabs.onUpdated.addListener((tabId: number, info) => {
      if (info.status == "loading") {
        this.findRepository.deleteLocalState(tabId);
      }
    });
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install" && details.reason !== "update") {
        return;
      }
      this.versionController.notify();
    });

    this.contentMessageListener.run();
    this.findPortListener.run();
  }

  private onFindPortConnect(port: browser.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }

    this.frameRepository.addFrameId(tabId, frameId);
  }

  private onFindPortDisconnect(port: browser.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }

    this.frameRepository.removeFrameId(tabId, frameId);
  }
}
