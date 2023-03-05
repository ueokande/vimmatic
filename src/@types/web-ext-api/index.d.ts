declare namespace chrome.tabs {
  function toggleReaderMode(tabId?: number): Promise<void>;
}

declare namespace chrome.browserSettings.homepageOverride {
  type BrowserSettings = {
    value: string;
    levelOfControl: LevelOfControlType;
  };

  type LevelOfControlType =
    | "not_controllable"
    | "controlled_by_other_extensions"
    | "controllable_by_this_extension"
    | "controlled_by_this_extension";

  function get(param: { [key: string]: string }): Promise<BrowserSettings>;
}

declare namespace chrome.sessions {
  function getRecentlyClosed(
    filter?: browser.sessions.Filter,
    callback?: function
  ): Promise<chrome.sessions.Session[]>;

  function restore(sessionId?: string): Promise<chrome.sessions.Session>;
}
