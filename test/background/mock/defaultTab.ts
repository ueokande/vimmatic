export const defaultTab: chrome.tabs.Tab = {
  index: 0,
  title: "Example",
  url: "https://examle.com/",
  highlighted: false,
  active: true,
  pinned: false,
  incognito: false,
  windowId: 0,
  selected: false,
  discarded: false,
  autoDiscardable: false,
  groupId: 0,
} as const;
