import { injectable, inject } from "inversify";
import WindowMessageListener from "./messaging/WindowMessageListener";
import ContentMessageListener from "./messaging/ContentMessageListener";
import KeymapController from "./controllers/KeymapController";
import BackgroundKeyController from "./controllers/BackgroundKeyController";
import SettingsController from "./controllers/SettingsController";
import InputDriver from "./InputDriver";

@injectable()
export default class Application {
  // eslint-disable-next-line max-params
  constructor(
    @inject(WindowMessageListener)
    private readonly windowMessageListener: WindowMessageListener,
    @inject(ContentMessageListener)
    private readonly contentMessageListener: ContentMessageListener,
    @inject(KeymapController)
    private readonly keymapController: KeymapController,
    @inject(BackgroundKeyController)
    private readonly backgroundKeyController: BackgroundKeyController,
    @inject(SettingsController)
    private readonly settingsController: SettingsController,
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

    return Promise.resolve();
  }

  private routeFocusEvents() {
    window.addEventListener("blur", () => {
      this.keymapController.onBlurWindow();
    });
  }

  private routeKeymaps() {
    const inputDriver = new InputDriver(window.document.body);
    inputDriver.onKey((key) => this.backgroundKeyController.press(key));
    inputDriver.onKey((key) => this.keymapController.press(key));
  }
}
