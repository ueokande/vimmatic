import BufferCommandHelper from "../../../src/background/command/BufferCommandHelper";
import LastSelectedTab from "../../../src/background/tabs/LastSelectedTab";

class MockLastSelectedTab implements LastSelectedTab {
  get(): number | undefined {
    throw new Error("not implemented");
  }
}

describe("BufferCommandHelper", () => {
  const lastSelectedTab = new MockLastSelectedTab();
  const sut = new BufferCommandHelper(lastSelectedTab);

  const mockGetLastSelectedTab = jest.spyOn(lastSelectedTab, "get");
  const mockTabsQuery = jest.spyOn(browser.tabs, "query");

  const allTabs = Array.from(Array(5).keys()).map((i) => ({
    id: 10 + i,
    index: i,
    pinned: i <= 1,
    active: i == 2,
    title: `tab${i + 1}`,
    url: `https://example.com/${i + 1}`,
    highlighted: false,
    incognito: false,
  }));

  beforeEach(() => {
    mockGetLastSelectedTab.mockClear();
    mockTabsQuery.mockClear();
    mockGetLastSelectedTab.mockReturnValue(14);
    mockTabsQuery.mockResolvedValue(allTabs);
  });

  describe("getCompletions", () => {
    test("returns tab completions maching with a query", async () => {
      let completions = await sut.getCompletions(true, "");
      expect(completions[0].items).toMatchObject([
        { primary: "1:   tab1", value: "https://example.com/1" },
        { primary: "2:   tab2", value: "https://example.com/2" },
        { primary: "3: % tab3", value: "https://example.com/3" },
        { primary: "4:   tab4", value: "https://example.com/4" },
        { primary: "5: # tab5", value: "https://example.com/5" },
      ]);

      completions = await sut.getCompletions(false, "");
      expect(completions[0].items).toMatchObject([
        { primary: "3: % tab3", value: "https://example.com/3" },
        { primary: "4:   tab4", value: "https://example.com/4" },
        { primary: "5: # tab5", value: "https://example.com/5" },
      ]);

      completions = await sut.getCompletions(true, "tab4");
      expect(completions[0].items).toMatchObject([
        { primary: "4:   tab4", value: "https://example.com/4" },
      ]);

      completions = await sut.getCompletions(true, "2");
      expect(completions[0].items).toMatchObject([
        { primary: "2:   tab2", value: "https://example.com/2" },
      ]);

      completions = await sut.getCompletions(true, "10");
      expect(completions[0].items).toHaveLength(0);
    });
  });

  describe("queryTabs", () => {
    test("returns tabs maching with a query", async () => {
      let tabs = await sut.queryTabs(true, "");
      expect(tabs).toMatchObject([
        { title: "tab1", url: "https://example.com/1" },
        { title: "tab2", url: "https://example.com/2" },
        { title: "tab3", url: "https://example.com/3" },
        { title: "tab4", url: "https://example.com/4" },
        { title: "tab5", url: "https://example.com/5" },
      ]);

      tabs = await sut.queryTabs(true, "tab2");
      expect(tabs).toMatchObject([
        { title: "tab2", url: "https://example.com/2" },
      ]);

      tabs = await sut.queryTabs(true, "/3");
      expect(tabs).toMatchObject([
        { title: "tab3", url: "https://example.com/3" },
      ]);

      tabs = await sut.queryTabs(true, "TAB");
      expect(tabs).toHaveLength(5);

      tabs = await sut.queryTabs(true, "EXAMPLE.COM");
      expect(tabs).toHaveLength(5);
    });
  });
});