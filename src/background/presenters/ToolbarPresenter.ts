import { injectable } from "inversify";

export default interface ToolbarPresenter {
  setEnabled(enabled: boolean): Promise<void>;

  onClick(listener: (arg: browser.tabs.Tab) => void): void;
}

@injectable()
export class ToolbarPresenterImpl {
  setEnabled(enabled: boolean): Promise<void> {
    const path = enabled
      ? "resources/enabled_32x32.png"
      : "resources/disabled_32x32.png";
    if (typeof browser.browserAction.setIcon === "function") {
      return browser.browserAction.setIcon({ path });
    }

    // setIcon not supported on Android
    return Promise.resolve();
  }

  onClick(listener: (arg: browser.tabs.Tab) => void): void {
    browser.browserAction.onClicked.addListener(listener);
  }
}
