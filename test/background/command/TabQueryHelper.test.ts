import { TabQueryHelper } from "../../../src/background/command/TabQueryHelper";
import { MockLastSelectedTabRepository } from "../mock/MockLastSelectedTabRepository";
import { defaultTab } from "../mock/defaultTab";
import { describe, test, expect, vi } from "vitest";

describe("TabQueryHelper", () => {
  const lastSelectedTabRepository = new MockLastSelectedTabRepository();
  const sut = new TabQueryHelper(lastSelectedTabRepository);

  vi.spyOn(lastSelectedTabRepository, "getLastSelectedTabId").mockResolvedValue(
    14,
  );
  vi.spyOn(chrome.tabs, "query").mockImplementation(
    async (opts: chrome.tabs.QueryInfo) =>
      allTabs
        .filter((t) => {
          if (typeof opts.active === "undefined") {
            return true;
          }
          return t.active === opts.active;
        })
        .filter((t) => {
          if (typeof opts.pinned === "undefined") {
            return true;
          }
          return t.pinned === opts.pinned;
        }),
  );

  /**
   * 0: tab1, https://example.com/1, pinned
   * 1: tab2, https://example.com/2, pinned
   * 2: tab3, https://example.com/3, unpinned, active
   * 3: tab4, https://example.com/4, unpinned
   * 4: tab5, https://example.com/5, unpinned
   */
  const allTabs: chrome.tabs.Tab[] = Array.from(Array(5).keys()).map((i) => ({
    ...defaultTab,
    id: 10 + i,
    index: i,
    pinned: i <= 1,
    active: i == 2,
    title: `tab${i + 1}`,
    url: `https://example.com/${i + 1}`,
  }));

  describe("getCompletions", () => {
    test("returns tab completions maching with a query", async () => {
      let completions = await sut.getCompletions("", { includePinned: true });
      expect(completions[0].items).toMatchObject([
        { primary: "1:   tab1", value: "https://example.com/1" },
        { primary: "2:   tab2", value: "https://example.com/2" },
        { primary: "3: % tab3", value: "https://example.com/3" },
        { primary: "4:   tab4", value: "https://example.com/4" },
        { primary: "5: # tab5", value: "https://example.com/5" },
      ]);

      completions = await sut.getCompletions("", { includePinned: false });
      expect(completions[0].items).toMatchObject([
        { primary: "3: % tab3", value: "https://example.com/3" },
        { primary: "4:   tab4", value: "https://example.com/4" },
        { primary: "5: # tab5", value: "https://example.com/5" },
      ]);

      completions = await sut.getCompletions("tab4", { includePinned: true });
      expect(completions[0].items).toMatchObject([
        { primary: "4:   tab4", value: "https://example.com/4" },
      ]);

      completions = await sut.getCompletions("2", { includePinned: true });
      expect(completions[0].items).toMatchObject([
        { primary: "2:   tab2", value: "https://example.com/2" },
      ]);

      completions = await sut.getCompletions("10", { includePinned: true });
      expect(completions[0].items).toHaveLength(0);
    });

    test("handles tabs with undefined title", async () => {
      const tabsWithUndefinedTitle: chrome.tabs.Tab[] = [
        {
          ...defaultTab,
          id: 20,
          index: 0,
          title: undefined,
          url: "https://example.com/no-title",
          pinned: false,
          active: true,
        },
      ];

      vi.spyOn(chrome.tabs, "query").mockResolvedValueOnce(
        tabsWithUndefinedTitle,
      );

      const completions = await sut.getCompletions("", { includePinned: true });
      expect(completions[0].items).toMatchObject([
        { primary: "1: % ", value: "https://example.com/no-title" },
      ]);
    });

    test("handles tabs with undefined url", async () => {
      vi.spyOn(chrome.tabs, "query").mockResolvedValueOnce([
        {
          ...defaultTab,
          id: 21,
          index: 0,
          title: "Tab without URL",
          url: undefined,
          pinned: false,
          active: true,
        },
      ]);

      const completions = await sut.getCompletions("", { includePinned: true });
      expect(completions[0].items).toMatchObject([
        { primary: "1: % Tab without URL", value: "1" },
      ]);
    });
  });

  describe("queryTabs", () => {
    test("returns tabs maching with a query", async () => {
      let tabs = await sut.queryTabs("", { includePinned: true });
      expect(tabs).toMatchObject([
        { title: "tab1", url: "https://example.com/1" },
        { title: "tab2", url: "https://example.com/2" },
        { title: "tab3", url: "https://example.com/3" },
        { title: "tab4", url: "https://example.com/4" },
        { title: "tab5", url: "https://example.com/5" },
      ]);

      tabs = await sut.queryTabs("tab2", { includePinned: true });
      expect(tabs).toMatchObject([
        { title: "tab2", url: "https://example.com/2" },
      ]);

      tabs = await sut.queryTabs("/3", { includePinned: true });
      expect(tabs).toMatchObject([
        { title: "tab3", url: "https://example.com/3" },
      ]);

      tabs = await sut.queryTabs("TAB", { includePinned: true });
      expect(tabs).toHaveLength(5);

      tabs = await sut.queryTabs("EXAMPLE.COM", { includePinned: true });
      expect(tabs).toHaveLength(5);
    });
  });
});
