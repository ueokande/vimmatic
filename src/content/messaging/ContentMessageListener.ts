import { injectable, inject } from "inversify";
import { Receiver } from "../../messaging";
import type { Schema } from "../../messaging/schema/content";
import MarkController from "../controllers/MarkController";
import AddonEnabledController from "../controllers/AddonEnabledController";
import SettingsController from "../controllers/SettingsController";
import ConsoleFrameController from "../controllers/ConsoleFrameController";
import NavigateController from "../controllers/NavigateController";
import FindController from "../controllers/FindController";

@injectable()
export default class ContentMessageListener {
  private readonly receiver: Receiver<Schema> = new Receiver();

  constructor(
    @inject(MarkController)
    markController: MarkController,
    @inject(AddonEnabledController)
    addonEnabledController: AddonEnabledController,
    @inject(SettingsController)
    settingsController: SettingsController,
    @inject(ConsoleFrameController)
    consoleFrameController: ConsoleFrameController,
    @inject(NavigateController)
    navigateController: NavigateController,
    @inject(FindController)
    findController: FindController
  ) {
    this.receiver
      .route("settings.changed")
      .to(settingsController.reloadSettings.bind(settingsController));
    this.receiver
      .route("addon.toggle.enabled")
      .to(
        addonEnabledController.toggleAddonEnabled.bind(addonEnabledController)
      );
    this.receiver
      .route("navigate.link.next")
      .to(navigateController.openLinkNext.bind(navigateController));
    this.receiver
      .route("navigate.link.prev")
      .to(navigateController.openLinkPrev.bind(navigateController));
    this.receiver
      .route("navigate.history.next")
      .to(navigateController.openHistoryNext.bind(navigateController));
    this.receiver
      .route("navigate.history.prev")
      .to(navigateController.openHistoryPrev.bind(navigateController));
    this.receiver
      .route("console.hide")
      .to(consoleFrameController.unfocus.bind(consoleFrameController));
    this.receiver
      .route("console.resize")
      .to(consoleFrameController.resize.bind(consoleFrameController));
    this.receiver
      .route("find.next")
      .to(findController.findNext.bind(findController));
    this.receiver
      .route("find.prev")
      .to(findController.findPrev.bind(findController));
    this.receiver
      .route("find.clear.selection")
      .to(
        findController.clearSelection.bind(findController).bind(findController)
      );

    if (window.self === window.top) {
      this.receiver
        .route("addon.enabled.query")
        .to(
          addonEnabledController.getAddonEnabled.bind(addonEnabledController)
        );
      this.receiver
        .route("tab.scroll.to")
        .to(markController.scrollTo.bind(markController));
    }
  }

  listen() {
    browser.runtime.onMessage.addListener(
      (message: unknown): Promise<unknown> | void => {
        if (typeof message !== "object" && message !== null) {
          console.warn("unexpected message format:", message);
          return;
        }
        const { type, args } = message as { type: unknown; args: unknown };
        if (
          typeof type !== "string" ||
          (typeof args !== "undefined" && typeof args !== "object")
        ) {
          console.warn("unexpected message format:", message);
          return;
        }

        try {
          const ret = this.receiver.receive(type, args);
          return Promise.resolve(ret);
        } catch (e) {
          console.error(e);
          return;
        }
      }
    );
  }
}
