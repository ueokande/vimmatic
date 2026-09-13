import { describe, expect, it } from "vitest";
import { isBlankUrlFrame } from "../../src/content/frame";

// Builds a minimal Window-like object.  `isBlankUrlFrame` only reads
// `win === win.top` and `win.location.href`.
const fakeWindow = (
  href: string,
  opts: { isTop?: boolean; throwOnLocation?: boolean } = {},
): Window => {
  const win = {
    get location(): Location {
      if (opts.throwOnLocation) {
        throw new Error("cross-origin");
      }
      return { href } as Location;
    },
  } as unknown as Window;
  // A top frame's `window.top` is itself.
  (win as { top: Window }).top = opts.isTop ? win : ({} as Window);
  return win;
};

describe("isBlankUrlFrame", () => {
  it("never treats the top window as a blank frame", () => {
    expect(isBlankUrlFrame(fakeWindow("about:blank", { isTop: true }))).toBe(
      false,
    );
  });

  it("treats about:blank sub-frames as blank", () => {
    expect(isBlankUrlFrame(fakeWindow("about:blank"))).toBe(true);
  });

  it("treats about:srcdoc sub-frames as blank", () => {
    expect(isBlankUrlFrame(fakeWindow("about:srcdoc"))).toBe(true);
  });

  it("treats an empty href as blank", () => {
    expect(isBlankUrlFrame(fakeWindow(""))).toBe(true);
  });

  it("treats a sub-frame with a real URL as a page", () => {
    expect(isBlankUrlFrame(fakeWindow("https://example.com/editor"))).toBe(
      false,
    );
  });

  it("treats a cross-origin sub-frame (location inaccessible) as a page", () => {
    expect(isBlankUrlFrame(fakeWindow("", { throwOnLocation: true }))).toBe(
      false,
    );
  });
});
