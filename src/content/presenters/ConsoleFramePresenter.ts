import { injectable } from "inversify";

export default interface ConsoleFramePresenter {
  attach(): void;

  detach(): void;

  blur(): void;

  resize(width: number, height: number): void;

  isTopWindow(): boolean;
}

@injectable()
export class ConsoleFramePresenterImpl implements ConsoleFramePresenter {
  private static readonly IframeId = "vimmatic-console-frame" as const;

  attach(): void {
    const ele = document.getElementById("vimmatic-console-frame");
    if (ele) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = browser.runtime.getURL("dist/console.html");
    iframe.id = ConsoleFramePresenterImpl.IframeId;
    iframe.className = "vimmatic-console-frame";
    iframe.name = "vimmatic-console-frame";
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
