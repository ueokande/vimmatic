type RequestContext = {
  sender: {
    tabId: number;
    frameId: number;
    tab: browser.tabs.Tab;
  };
};

export default RequestContext;
