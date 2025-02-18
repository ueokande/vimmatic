import { injectable, inject } from "inversify";
import { Receiver } from "../../messaging";
import type { Schema } from "../../messaging/schema/content";
import { AddonEnabledController } from "../controllers/AddonEnabledController";
import { SettingsController } from "../controllers/SettingsController";
import { ConsoleFrameController } from "../controllers/ConsoleFrameController";
import { NavigateController } from "../controllers/NavigateController";
import { FindController } from "../controllers/FindController";
import { VisualController } from "../controllers/VisualController";
import { ScrollController } from "../controllers/ScrollController";
import { FocusController } from "../controllers/FocusController";
import { ModeController } from "../controllers/ModeController";
import { FrameController } from "../controllers/FrameController";
import { TopFrameController } from "../controllers/TopFrameController";
import { HintController } from "../controllers/HintController";

@injectable()
export class ContentMessageListener {
  private readonly receiver: Receiver<Schema> = new Receiver();

  constructor(
    @inject(AddonEnabledController)
    addonEnabledController: AddonEnabledController,
    @inject(SettingsController)
    settingsController: SettingsController,
    @inject(ConsoleFrameController)
    consoleFrameController: ConsoleFrameController,
    @inject(NavigateController)
    navigateController: NavigateController,
    @inject(FindController)
    findController: FindController,
    @inject(VisualController)
    visualController: VisualController,
    @inject(ScrollController)
    scrollController: ScrollController,
    @inject(FocusController)
    focusController: FocusController,
    @inject(ModeController)
    modeController: ModeController,
    @inject(FrameController)
    frameController: FrameController,
    @inject(TopFrameController)
    topFrameController: TopFrameController,
    @inject(HintController)
    hintController: HintController,
  ) {
    this.receiver
      .route("addon.enable")
      .to(addonEnabledController.enable.bind(addonEnabledController));
    this.receiver
      .route("addon.disable")
      .to(addonEnabledController.disable.bind(addonEnabledController));
    this.receiver
      .route("settings.changed")
      .to(settingsController.reloadSettings.bind(settingsController));
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
    // this.receiver
    //   .route("find.visual.start")
    //   .to(visualController)
    this.receiver
      .route("visual.left")
      .to(visualController.moveLeft.bind(visualController));
    this.receiver
      .route("visual.right")
      .to(visualController.moveRight.bind(visualController));
    this.receiver
      .route("visual.word.next")
      .to(visualController.moveNextWord.bind(visualController));
    this.receiver
      .route("visual.word.end")
      .to(visualController.moveEndWord.bind(visualController));
    this.receiver
      .route("visual.word.back")
      .to(visualController.movePrevWord.bind(visualController));
    this.receiver
      .route("find.next")
      .to(findController.findNext.bind(findController));
    this.receiver
      .route("find.prev")
      .to(findController.findPrev.bind(findController));
    this.receiver
      .route("find.clear.selection")
      .to(findController.clearSelection.bind(findController));
    this.receiver
      .route("scroll.vertically")
      .to(scrollController.scrollVertically.bind(scrollController));
    this.receiver
      .route("scroll.horizonally")
      .to(scrollController.scrollHorizonally.bind(scrollController));
    this.receiver
      .route("scroll.pages")
      .to(scrollController.scrollPages.bind(scrollController));
    this.receiver
      .route("scroll.top")
      .to(scrollController.scrollToTop.bind(scrollController));
    this.receiver
      .route("scroll.bottom")
      .to(scrollController.scrollToBottom.bind(scrollController));
    this.receiver
      .route("scroll.home")
      .to(scrollController.scrollToHome.bind(scrollController));
    this.receiver
      .route("scroll.end")
      .to(scrollController.scrollToEnd.bind(scrollController));
    this.receiver
      .route("focus.input")
      .to(focusController.focusFirstElement.bind(focusController));
    this.receiver
      .route("set.mode")
      .to(modeController.setMode.bind(modeController));
    this.receiver
      .route("get.scroll")
      .to(scrollController.getScroll.bind(scrollController));
    this.receiver
      .route("scroll.to")
      .to(scrollController.scrollTo.bind(scrollController));
    this.receiver
      .route("notify.frame.id")
      .to(frameController.notifyToParent.bind(frameController));
    this.receiver
      .route("get.window.viewport")
      .to(topFrameController.getWindowViewport.bind(topFrameController));
    this.receiver
      .route("get.frame.position")
      .to(topFrameController.getFramePosition.bind(topFrameController));
    this.receiver
      .route("hint.lookup")
      .to(hintController.lookupTargets.bind(hintController));
    this.receiver
      .route("hint.assign")
      .to(hintController.assignTags.bind(hintController));
    this.receiver
      .route("hint.show")
      .to(hintController.showHints.bind(hintController));
    this.receiver
      .route("hint.clear")
      .to(hintController.clearHints.bind(hintController));
    this.receiver
      .route("hint.getElement")
      .to(hintController.getElement.bind(hintController));
    this.receiver
      .route("hint.focus")
      .to(hintController.focusElement.bind(hintController));
    this.receiver
      .route("hint.click")
      .to(hintController.clickElement.bind(hintController));
  }

  listen() {
    chrome.runtime.onMessage.addListener(
      (message: unknown, _sender, sendResponse) => {
        if (typeof message !== "object" && message !== null) {
          // eslint-disable-next-line no-console
          console.warn("unexpected message format:", message);
          return;
        }
        const { type, args } = message as { type: unknown; args: unknown };
        if (
          typeof type !== "string" ||
          (typeof args !== "undefined" && typeof args !== "object")
        ) {
          // eslint-disable-next-line no-console
          console.warn("unexpected message format:", message);
          return;
        }

        if (process.env.NODE_ENV === "development") {
          const style = "background-color: purple; color: white; padding: 4px;";
          // eslint-disable-next-line no-console
          console.debug("%cRECEIVE%c %s %o", style, "", type, args);
        }

        const ret = this.receiver.receive(type, args);
        Promise.resolve(ret)
          .then(sendResponse)
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
        return true;
      },
    );
  }
}
