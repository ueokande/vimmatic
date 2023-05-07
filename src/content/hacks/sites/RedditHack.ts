import SiteHack from "../SiteHack";

export default class RedditHack implements SiteHack {
  match(): boolean {
    return window.location.hostname === "www.reddit.com";
  }

  fromInput(e: HTMLElement): boolean {
    if (e.tagName === "REDDIT-SEARCH-LARGE") {
      return true;
    }
    return false;
  }
}
