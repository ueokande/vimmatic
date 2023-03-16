import { injectable } from "inversify";

export default interface ToolbarPresenter {
  setEnabled(enabled: boolean): Promise<void>;

  onClick(listener: (arg: chrome.tabs.Tab) => void): void;
}

@injectable()
export class ToolbarPresenterImpl {
  async setEnabled(enabled: boolean): Promise<void> {
    const path = enabled
      ? "../resources/enabled_32x32.png"
      : "../resources/disabled_32x32.png";

    return chrome.action.setIcon({ path });
  }

  onClick(listener: (arg: chrome.tabs.Tab) => void): void {
    chrome.action.onClicked.addListener(listener);
  }
}
