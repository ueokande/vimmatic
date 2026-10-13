import { describe, expect, it, vi } from "vitest";
import { OpenCommandHelper } from "../../../src/background/command/OpenCommandHelper";
import type { SearchEngineSettings } from "../../../src/background/settings/SearchEngineSettings";
import type { Search } from "../../../src/shared/search";
import { asAsyncSpy } from "../../asAsyncSpy";
import { MockPropertySettings } from "../mock/MockPropertySettings";

class MockSearchEngineSettings implements SearchEngineSettings {
  get(): Promise<Search> {
    throw new Error("not implemented");
  }
}

describe("OpenCommandHelper", () => {
  const propertySettings = new MockPropertySettings();
  const searchEngineSettings = new MockSearchEngineSettings();
  const sut = new OpenCommandHelper(searchEngineSettings, propertySettings);

  const mockHistorySearch = asAsyncSpy<
    [chrome.history.HistoryQuery],
    chrome.history.HistoryItem[]
  >(vi.spyOn(chrome.history, "search")).mockImplementation(() =>
    Promise.resolve([]),
  );
  const mockBookmarksSearch = asAsyncSpy<
    [string],
    chrome.bookmarks.BookmarkTreeNode[]
  >(vi.spyOn(chrome.bookmarks, "search")).mockResolvedValue([]);
  vi.spyOn(chrome.runtime, "getURL").mockImplementation(
    (path: string) => `chrome-extension://extensionid/${path}`,
  );
  vi.spyOn(propertySettings, "getProperty").mockImplementation((name) => {
    if (name === "complete") {
      return Promise.resolve("sbh");
    }
    throw new Error(`unexpected property name: ${name}`);
  });
  vi.spyOn(searchEngineSettings, "get").mockResolvedValue({
    defaultEngine: "google",
    engines: {
      yahoo: "https://search.yahoo.com/search?p={}",
      google: "https://google.com/search?q={}",
    },
  });

  it("it returns from search engines, bookmarks, and histories", async () => {
    const completions = await sut.getCompletions("");

    expect(completions).toHaveLength(3);
    expect(completions[0].name).toBe("Search Engines");
    expect(completions[1].name).toBe("Bookmarks");
    expect(completions[2].name).toBe("History");
  });

  describe("search engines", () => {
    it("it returns search engines", async () => {
      const completions = await sut.getCompletions("");

      expect(completions[0].items).toMatchObject([
        { primary: "yahoo", value: "yahoo" },
        { primary: "google", value: "google" },
      ]);
    });
  });

  describe("bookmarks", () => {
    it("returns bookmarks", async () => {
      mockBookmarksSearch.mockResolvedValue([
        { id: "0", title: "com", url: "https://example.com", syncing: false },
        { id: "1", title: "net", url: "https://example.net", syncing: false },
        { id: "2", title: "org", url: "https://example.org", syncing: false },
      ]);

      const completions = await sut.getCompletions("");

      expect(completions[1].items).toMatchObject([
        { primary: "com", value: "https://example.com" },
        { primary: "net", value: "https://example.net" },
        { primary: "org", value: "https://example.org" },
      ]);
    });

    it("filters empty bookmarks", async () => {
      mockBookmarksSearch.mockResolvedValue([
        { id: "0", title: "my bookmarks", syncing: false },
        { id: "1", title: "", url: "https://example.com", syncing: false },
        { id: "3", title: "invalid url", url: "********", syncing: false },
        { id: "4", title: "empty url", syncing: false },
      ]);

      const completions = await sut.getCompletions("");

      expect(completions[1].items).toHaveLength(0);
    });

    it("limits max items", async () => {
      mockBookmarksSearch.mockResolvedValue(
        Array(30).fill({
          id: "0",
          title: "com",
          url: "https://example.com",
          syncing: false,
        }),
      );

      const completions = await sut.getCompletions("");

      expect(completions[1].items).toHaveLength(10);
    });
  });

  describe("histories", () => {
    it("returns histories", async () => {
      mockHistorySearch.mockImplementation(() =>
        Promise.resolve([
          { id: "0", title: "com", url: "https://example.com" },
          { id: "1", title: "net", url: "https://example.net" },
          { id: "2", title: "org", url: "https://example.org" },
        ]),
      );

      const completions = await sut.getCompletions("");

      expect(completions[2].items).toMatchObject([
        {
          primary: "com",
          value: "https://example.com",
          icon: "chrome-extension://extensionid/_favicon/?pageUrl=https%3A%2F%2Fexample.com&size=32",
        },
        {
          primary: "net",
          value: "https://example.net",
          icon: "chrome-extension://extensionid/_favicon/?pageUrl=https%3A%2F%2Fexample.net&size=32",
        },
        {
          primary: "org",
          value: "https://example.org",
          icon: "chrome-extension://extensionid/_favicon/?pageUrl=https%3A%2F%2Fexample.org&size=32",
        },
      ]);
    });

    it("uses Google's favicon API on Firefox", async () => {
      vi.stubEnv("BROWSER", "firefox");
      mockHistorySearch.mockImplementation(() =>
        Promise.resolve([
          { id: "0", title: "com", url: "https://example.com" },
        ]),
      );

      const completions = await sut.getCompletions("");

      expect(completions[2].items).toMatchObject([
        {
          primary: "com",
          value: "https://example.com",
          icon: "https://www.google.com/s2/favicons?domain=example.com&sz=32",
        },
      ]);

      vi.unstubAllEnvs();
    });

    it("reduces duplicated and similar URLs", async () => {
      mockHistorySearch.mockImplementation(() =>
        Promise.resolve([
          { id: "1", title: "subpath", url: "https://example.new/hoge/fuga" },
          { id: "2", title: "subpath", url: "https://example.new/hoge" },
          { id: "3", title: "subpath", url: "http://example.new/hoge" },
        ]),
      );

      const completions = await sut.getCompletions("");

      expect(completions[2].items).toMatchObject([
        { primary: "subpath", value: "https://example.new/hoge/fuga" },
        { primary: "subpath", value: "https://example.new/hoge" },
      ]);
    });

    it("limits max items", async () => {
      mockHistorySearch.mockImplementation(() =>
        Promise.resolve(
          Array(30).fill({
            id: "1",
            title: "subpath",
            url: "https://example.new/hoge/fuga",
          }),
        ),
      );

      const completions = await sut.getCompletions("");

      expect(completions[2].items).toHaveLength(10);
    });
  });
});
