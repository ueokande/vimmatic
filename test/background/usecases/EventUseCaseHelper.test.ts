import { describe, expect, it, vi } from "vitest";
import { EventUseCaseHelper } from "../../../src/background/usecases/EventUseCaseHelper";

describe("EventUseCaseHelper", () => {
  describe("#isSystemTab", () => {
    it.each([
      ["https://example.com/", false],
      ["http://example.com/", false],
      ["about:addons", true],
      ["chrome://extensions/", true],
      [undefined, true],
    ])("returns system tab or not for %s", async (url, expected) => {
      chrome.tabs.get = vi.fn().mockResolvedValue({ id: 1, url });
      const sut = new EventUseCaseHelper();

      expect(await sut.isSystemTab(1)).toBe(expected);
    });
  });
});
