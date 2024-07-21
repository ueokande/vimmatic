import { injectable, inject } from "inversify";
import { WindowMessageListener } from "./messaging/WindowMessageListener";
import { ContentMessageListener } from "./messaging/ContentMessageListener";
import { KeyController } from "./controllers/KeyController";
import { SettingsController } from "./controllers/SettingsController";
import { InputDriver } from "./InputDriver";
import { ReadyStatusPresenter } from "./presenters/ReadyStatusPresenter";

@injectable()
export class Application {
  // eslint-disable-next-line max-params
  constructor(
    @inject(WindowMessageListener)
    private readonly windowMessageListener: WindowMessageListener,
    @inject(ContentMessageListener)
    private readonly contentMessageListener: ContentMessageListener,
    @inject(KeyController)
    private readonly keyController: KeyController,
    @inject(SettingsController)
    private readonly settingsController: SettingsController,
    @inject(ReadyStatusPresenter)
    private readonly readyStatusPresenter: ReadyStatusPresenter,
  ) {}

  init(): Promise<void> {
    if (window === window.top) {
      this.windowMessageListener.listen();
    }
    this.contentMessageListener.listen();
    this.routeFocusEvents();
    this.routeKeymaps();
    this.settingsController.initSettings();

    // Ping to background script and notify content script is ready with its
    // frame id.  Background script gathers frame ids on the tab and use them
    // when it communicate with each frames.
    //
    // The port is never used, and the messages are delivered via
    // `chrome.tabs.sendMessage` API with a frame ID.
    chrome.runtime.connect({ name: "vimmatic-port" });

    this.readyStatusPresenter.setContentReady();

    return Promise.resolve();
  }

  private routeFocusEvents() {
    window.addEventListener("blur", () => {
      this.keyController.cancel();
    });
  }

  private routeKeymaps() {
    const inputDriver = new InputDriver(window.document.body);
    inputDriver.onKey((key) => this.keyController.press(key));
  }
}
