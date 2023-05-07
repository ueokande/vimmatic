import type SiteHack from "../SiteHack";
import Key from "../../../../src/shared/Key";

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

  reservedKeys(): Key[] {
    return [
      new Key({ key: "?" }),
      new Key({ key: "j" }),
      new Key({ key: "k" }),
      new Key({ key: "n" }),
      new Key({ key: "p" }),
      new Key({ key: "Enter" }),
      new Key({ key: "x" }),
      new Key({ key: "l" }),
      new Key({ key: "a" }),
      new Key({ key: "z" }),
      new Key({ key: "c" }),
      new Key({ key: "r" }),
      new Key({ key: "Enter", ctrl: true }),
      new Key({ key: "s" }),
      new Key({ key: "h" }),
      new Key({ key: "q" }),
    ];
  }
}
