import OpenCommandHelper from "../../../src/background/command/OpenCommandHelper";
import SearchEngineSettings from "../../../src/background/settings/SearchEngineSettings";
import Search from "../../../src/shared/Search";
import MockPropertySettings from "../mock/MockPropertySettings";

class MockSearchEngineSettings implements SearchEngineSettings {
  get(): Promise<Search> {
    throw new Error("not implemented");
  }
}

describe("OpenCommandHelper", () => {
  const propertySettings = new MockPropertySettings();
  const searchEngineSettings = new MockSearchEngineSettings();
  const sut = new OpenCommandHelper(searchEngineSettings, propertySettings);

  const mockGetProperty = jest.spyOn(propertySettings, "getProperty");
  const mockGetSearchEngines = jest.spyOn(searchEngineSettings, "get");
  const mockHistorySearch = jest.spyOn(chrome.history, "search");
  const mockBookmarksSearch = jest.spyOn(chrome.bookmarks, "search");

  beforeEach(() => {
    mockHistorySearch.mockClear();
    mockBookmarksSearch.mockClear();
    mockGetProperty.mockClear();
    mockGetSearchEngines.mockClear();

    mockHistorySearch.mockResolvedValue([]);
    mockBookmarksSearch.mockResolvedValue([]);
    mockGetProperty.mockImplementation((name) => {
      if (name === "complete") {
        return Promise.resolve("sbh");
      }
      throw new Error(`unexpected property name: ${name}`);
    });
    mockGetSearchEngines.mockResolvedValue({
      defaultEngine: "google",
      engines: {
        yahoo: "https://search.yahoo.com/search?p={}",
        google: "https://google.com/search?q={}",
      },
      toJSON: () => {
        throw new Error("not implemented");
      },
    });
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
        { id: "0", title: "com", url: "https://example.com" },
        { id: "1", title: "net", url: "https://example.net" },
        { id: "2", title: "org", url: "https://example.org" },
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
        { id: "0", title: "my bookmarks" },
        { id: "1", title: "", url: "https://example.com" },
        { id: "3", title: "invalid url", url: "********" },
        { id: "4", title: "empty url" },
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
        })
      );

      const completions = await sut.getCompletions("");

      expect(completions[1].items).toHaveLength(10);
    });
  });

  describe("histories", () => {
    it("returns histories", async () => {
      mockHistorySearch.mockResolvedValue([
        { id: "0", title: "com", url: "https://example.com" },
        { id: "1", title: "net", url: "https://example.net" },
        { id: "2", title: "org", url: "https://example.org" },
      ]);

      const completions = await sut.getCompletions("");

      expect(completions[2].items).toMatchObject([
        { primary: "com", value: "https://example.com" },
        { primary: "net", value: "https://example.net" },
        { primary: "org", value: "https://example.org" },
      ]);
    });

    it("reduces duplicated and similar URLs", async () => {
      mockHistorySearch.mockResolvedValue([
        { id: "1", title: "subpath", url: "https://example.new/hoge/fuga" },
        { id: "2", title: "subpath", url: "https://example.new/hoge" },
        { id: "3", title: "subpath", url: "http://example.new/hoge" },
      ]);

      const completions = await sut.getCompletions("");

      expect(completions[2].items).toMatchObject([
        { primary: "subpath", value: "https://example.new/hoge/fuga" },
        { primary: "subpath", value: "https://example.new/hoge" },
      ]);
    });

    it("limits max items", async () => {
      mockHistorySearch.mockResolvedValue(
        Array(30).fill({
          id: "1",
          title: "subpath",
          url: "https://example.new/hoge/fuga",
        })
      );

      const completions = await sut.getCompletions("");

      expect(completions[2].items).toHaveLength(10);
    });
  });
});
