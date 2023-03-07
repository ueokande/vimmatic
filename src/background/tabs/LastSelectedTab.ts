import { injectable } from "inversify";

let currentSelectedTabId: number | undefined;
let lastSelectedTabId: number | undefined;
let registered = false;

export default interface LastSelectedTab {
  get(): number | undefined;
}

@injectable()
export class LastSelectedTabImpl implements LastSelectedTab {
  get(): number | undefined {
    return lastSelectedTabId;
  }
}

if (!registered) {
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    lastSelectedTabId = currentSelectedTabId;
    currentSelectedTabId = tabId;
  });
  registered = true;
}
