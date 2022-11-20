import Operator from "../Operator";

export default class NavigateParentOperator implements Operator {
  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id || !tab.url) {
      return;
    }
    const url = new URL(tab.url);
    if (url.hash.length > 0) {
      url.hash = "";
    } else if (url.search.length > 0) {
      url.search = "";
    } else {
      const basenamePattern = /\/[^/]+$/;
      const lastDirPattern = /\/[^/]+\/$/;
      if (basenamePattern.test(url.pathname)) {
        url.pathname = url.pathname.replace(basenamePattern, "/");
      } else if (lastDirPattern.test(url.pathname)) {
        url.pathname = url.pathname.replace(lastDirPattern, "/");
      }
    }
    await browser.tabs.update(tab.id, { url: url.href });
  }
}
