let currentSelectedTabId: number | undefined;
let lastSelectedTabId: number | undefined;

export default interface LastSelectedTab {
  get(): Promise<number | undefined>;
}

export class LastSelectedTabImpl implements LastSelectedTab {
  async get(): Promise<number | undefined> {
    return Promise.resolve(lastSelectedTabId);
  }
}

browser.tabs.onActivated.addListener(({ tabId }) => {
  lastSelectedTabId = currentSelectedTabId;
  currentSelectedTabId = tabId;
});
