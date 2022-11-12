import { injectable, inject } from "inversify";
import WindowMessageListener from "./messaging/WindowMessageListener";
import ContentMessageListener from "./messaging/ContentMessageListener";
import FollowKeyController from "./controllers/FollowKeyController";
import MarkKeyController from "./controllers/MarkKeyController";
import KeymapController from "./controllers/KeymapController";
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
    @inject(FollowKeyController)
    private readonly followKeyController: FollowKeyController,
    @inject(MarkKeyController)
    private readonly markKeyController: MarkKeyController,
    @inject(KeymapController)
    private readonly keymapController: KeymapController,
    @inject(SettingsController)
    private readonly settingsController: SettingsController
  ) {}

  init(): Promise<void> {
    this.windowMessageListener.listen();
    this.contentMessageListener.listen();
    this.routeFocusEvents();
    // Make sure the background script sends a message to the content script by
    // establishing a connection.  If the background script tries to send a
    // message to a frame on which cannot run the content script, it fails with
    // a message "Could not establish connection."
    //
    // The port is never used, and the messages are delivered via
    // `browser.tabs.sendMessage` API because sending a message via port cannot
    // receive returned value.
    //
    // /* on background script */
    // port.sendMessage({ type: "do something" });  <- returns void
    //
    browser.runtime.connect(undefined, { name: "vimmatic-find" });

    this.routeKeymaps();
    this.settingsController.initSettings();

    return Promise.resolve();
  }

  private routeFocusEvents() {
    window.addEventListener("blur", () => {
      this.keymapController.onBlurWindow();
    });
  }

  private routeKeymaps() {
    const inputDriver = new InputDriver(window.document.body);
    inputDriver.onKey((key) => this.followKeyController.press(key));
    inputDriver.onKey((key) => this.markKeyController.press(key));
    inputDriver.onKey((key) => this.keymapController.press(key));
  }
}
