import { injectable } from "inversify";

export default interface ToolbarPresenter {
  setEnabled(enabled: boolean): Promise<void>;

  onClick(listener: (arg: chrome.tabs.Tab) => void): void;
}

@injectable()
export class ToolbarPresenterImpl {
  async setEnabled(enabled: boolean): Promise<void> {
    const path = enabled
      ? "resources/enabled_32x32.png"
      : "resources/disabled_32x32.png";

    // chrome.action is supported on v3 api
    if (
      typeof chrome.action !== "undefined" &&
      typeof chrome.action.setIcon === "function"
    ) {
      return chrome.action.setIcon({ path });
    }

    // firefox does not support chrome.action
    if (
      typeof chrome.browserAction !== "undefined" &&
      typeof chrome.browserAction.setIcon === "function"
    ) {
      // v2 api on chromium requires callback on the 2nd argument
      return new Promise((resolve) =>
        chrome.browserAction.setIcon({ path }, resolve)
      );
    }
  }

  onClick(listener: (arg: chrome.tabs.Tab) => void): void {
    // chrome.action is supported on v3 api
    if (typeof chrome.action !== "undefined") {
      chrome.action.onClicked.addListener(listener);
      return;
    }

    // firefox does not support chrome.action
    if (typeof chrome.browserAction !== "undefined") {
      chrome.action.onClicked.addListener(listener);
    }
  }
}
