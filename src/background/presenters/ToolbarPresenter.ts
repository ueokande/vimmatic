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
    if (typeof chrome.action.setIcon === "function") {
      return chrome.action.setIcon({ path });
    }

    // setIcon not supported on Android
    return Promise.resolve();
  }

  onClick(listener: (arg: chrome.tabs.Tab) => void): void {
    chrome.action.onClicked.addListener(listener);
  }
}
