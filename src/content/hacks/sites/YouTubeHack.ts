import type SiteHack from "../SiteHack";
import Key from "../../../../src/shared/Key";

export default class YouTubeHack implements SiteHack {
  match(): boolean {
    return (
      window.location.hostname === "www.youtube.com" &&
      window.location.pathname == "/watch"
    );
  }

  fromInput(_e: HTMLElement): boolean {
    return false;
  }

  reservedKeys(): Key[] {
    return [
      new Key({ key: "?" }),
      new Key({ key: "k" }),
      new Key({ key: "j" }),
      new Key({ key: "l" }),
      new Key({ key: "P", shift: true }),
      new Key({ key: "N", shift: true }),
      new Key({ key: "," }),
      new Key({ key: "." }),
      new Key({ key: "<" }),
      new Key({ key: ">" }),
      new Key({ key: "0" }),
      new Key({ key: "1" }),
      new Key({ key: "2" }),
      new Key({ key: "3" }),
      new Key({ key: "4" }),
      new Key({ key: "5" }),
      new Key({ key: "6" }),
      new Key({ key: "7" }),
      new Key({ key: "8" }),
      new Key({ key: "9" }),
      new Key({ key: "ArrowLeft", alt: true }),
      new Key({ key: "ArrowRight", alt: true }),
      new Key({ key: "f" }),
      new Key({ key: "t" }),
      new Key({ key: "i" }),
      new Key({ key: "Escape" }),
      new Key({ key: "m" }),
      new Key({ key: "c" }),
      new Key({ key: "o" }),
      new Key({ key: "+" }),
      new Key({ key: "-" }),
      new Key({ key: "w" }),
      new Key({ key: "a" }),
      new Key({ key: "s" }),
      new Key({ key: "d" }),
      new Key({ key: "]" }),
      new Key({ key: "[" }),
    ];
  }
}
