import { provide } from "inversify-binding-decorators";

export interface ConsoleFramePresenter {
  attach(): void;

  detach(): void;

  blur(): void;

  resize(width: number, height: number): void;

  isTopWindow(): boolean;
}

const FRAME_STYLES = {
  margin: "0",
  padding: "0",
  bottom: "0",
  left: "0",
  height: "0",
  width: "100%",
  position: "fixed",
  "z-index": "2147483647", // to be on top of all other elements and hints
  border: "none",
  "background-color": "unset",
  "pointer-events": "none",
} as const;

export const ConsoleFramePresenter = Symbol("ConsoleFramePresenter");

@provide(ConsoleFramePresenter)
export class ConsoleFramePresenterImpl implements ConsoleFramePresenter {
  private static readonly IframeId = "vimmatic-console-frame" as const;

  attach(): void {
    const ele = document.getElementById("vimmatic-console-frame");
    if (ele) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("lib/console.html");
    iframe.id = ConsoleFramePresenterImpl.IframeId;
    iframe.name = "vimmatic-console-frame";
    for (const [name, value] of Object.entries(FRAME_STYLES)) {
      iframe.style.setProperty(name, value, "important");
    }
    document.body.append(iframe);
  }

  detach(): void {
    const ele = document.getElementById(ConsoleFramePresenterImpl.IframeId);
    if (!ele) {
      return;
    }
    ele.remove();
  }

  blur(): void {
    const ele = document.getElementById("vimmatic-console-frame");
    if (!ele) {
      return;
    }
    ele.blur();
    ele.style.setProperty("height", "0", "important");
  }

  resize(_width: number, height: number): void {
    const ele = document.getElementById("vimmatic-console-frame");
    if (!ele) {
      return;
    }
    ele.style.height = `${height}px`;
  }

  isTopWindow(): boolean {
    return window.top === window;
  }
}
