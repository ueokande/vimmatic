import { injectable, inject } from "inversify";
import type { HintClient } from "../clients/HintClient";
import type { HTMLElementType } from "../../shared/HTMLElementType";
import type { TabPresenter } from "../presenters/TabPresenter";
import type { HintTarget, HintAction } from "./types";

@injectable()
export class QuickHintAction implements HintAction {
  constructor(
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
  ) {}

  lookupTargetSelector(): string {
    return [
      "a",
      "button",
      "input",
      "textarea",
      "area",
      "[contenteditable=true]",
      '[contenteditable=""]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      "[onclick]",
      "summary",
    ].join(",");
  }

  async activate(
    tabId: number,
    target: HintTarget,
    opts: {
      newTab: boolean;
      background: boolean;
    },
  ): Promise<void> {
    const element = await this.hintClient.getElement(
      tabId,
      target.frameId,
      target.element,
    );
    if (!element) {
      return;
    }

    switch (element.tagName.toLowerCase()) {
      case "a":
      case "area":
        this.openLink(
          tabId,
          target.frameId,
          {
            ...element,
            elementId: target.element,
          },
          opts,
        );
        break;
      case "input":
        switch (element.attributes["type"]?.toLowerCase()) {
          case "file":
          case "checkbox":
          case "radio":
          case "submit":
          case "reset":
          case "button":
          case "image":
          case "color":
            this.click(tabId, target.frameId, target.element);
            break;
          default:
            this.focus(tabId, target.frameId, target.element);
            break;
        }
        break;
      case "textarea":
        this.focus(tabId, target.frameId, target.element);
        break;
      case "button":
      case "summary":
        this.click(tabId, target.frameId, target.element);
        break;
      default:
        if (element.attributes["contenteditable"]) {
          this.focus(tabId, target.frameId, target.element);
        } else if (
          element.attributes["tabindex"] ||
          element.attributes["onclick"]
        ) {
          this.click(tabId, target.frameId, target.element);
        }
    }
  }

  private async openLink(
    tabId: number,
    frameId: number,
    element: HTMLElementType & { elementId: string },
    opts: { newTab: boolean; background: boolean },
  ): Promise<void> {
    const href = element.href;
    const target = element.attributes["target"];
    let openNewtab = opts.newTab;
    if (target === "_blank") {
      openNewtab = true;
    }
    if (!href || href === "#" || href.startsWith("javascript:")) {
      this.click(tabId, frameId, element.elementId);
      return;
    }
    if (openNewtab) {
      this.tabPresenter.openNewTab(href, tabId, opts.background);
    } else {
      this.tabPresenter.openToTab(href, tabId);
    }
  }

  private async click(
    tabId: number,
    frameId: number,
    elementId: string,
  ): Promise<void> {
    this.hintClient.clickElement(tabId, frameId, elementId);
  }

  private async focus(
    tabId: number,
    frameId: number,
    elementId: string,
  ): Promise<void> {
    this.hintClient.focusElement(tabId, frameId, elementId);
  }
}
