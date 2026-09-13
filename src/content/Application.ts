import { inject, injectable } from "inversify";
import { BackgroundFocusClient } from "./client/BackgroundFocusClient";
import { KeyController } from "./controllers/KeyController";
import { SettingsController } from "./controllers/SettingsController";
import { FocusStateDriver } from "./FocusStateDriver";
import { InputDriver } from "./InputDriver";
import { ContentMessageListener } from "./messaging/ContentMessageListener";
import { WindowMessageListener } from "./messaging/WindowMessageListener";
import { PortConnector } from "./PortConnector";
import { ReadyStatusPresenter } from "./presenters/ReadyStatusPresenter";

@injectable()
export class Application {
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
    @inject(BackgroundFocusClient)
    private readonly backgroundFocusClient: BackgroundFocusClient,
  ) {}

  private readonly portConnector = new PortConnector();

  init(): Promise<void> {
    if (window === window.top) {
      this.windowMessageListener.listen();
    }

    // Install the message listener BEFORE announcing readiness.  This ordering
    // is the readiness handshake: the background only sends messages to frames
    // it has registered in `ReadyFrameRepository`, and that registration is
    // driven by the port connection opened below.  By registering the
    // `chrome.runtime.onMessage` listener first, we guarantee that by the time
    // the background learns about this frame (via the port `onConnect`), the
    // frame is already able to receive messages.  This removes the send/receive
    // race that previously required retries on the background side.
    this.contentMessageListener.listen();

    this.routeFocusEvents();
    this.routeFocusState();
    this.routeKeymaps();
    this.settingsController.initSettings();

    // Open a long-lived port to the background as the readiness signal.  The
    // port itself carries no data; messages are delivered via
    // `chrome.tabs.sendMessage` with a frame ID.  Its `onConnect` on the
    // background side is what registers this (now listening) frame as ready.
    //
    // The port is reconnected automatically when it is disconnected (e.g. the
    // MV3 background service worker is terminated) so the frame re-registers
    // itself, and re-announces its readiness, to a freshly started background.
    this.portConnector.start();

    this.readyStatusPresenter.setContentReady();

    return Promise.resolve();
  }

  private routeFocusEvents() {
    window.addEventListener("blur", () => {
      this.keyController.cancel();
    });
  }

  private routeFocusState() {
    // Report this frame's editable-focus transitions to the background, which
    // aggregates a single per-tab insert/normal mode and broadcasts it back to
    // every frame.  This is what stops a child frame's insert state from being
    // invisible to the parent frame and the mode indicator.
    const focusStateDriver = new FocusStateDriver(window.document);
    focusStateDriver.onChange((focused) => {
      this.backgroundFocusClient
        .notifyFocusChanged(focused)
        // biome-ignore lint/suspicious/noConsole: intentional debug logging
        .catch(console.error);
    });
  }

  private routeKeymaps() {
    const inputDriver = new InputDriver(window.document.body);
    inputDriver.onKey((key) => this.keyController.press(key));
  }
}
