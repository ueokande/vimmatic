import BufferCommand from "../../../src/background/command/BufferCommand";
import BufferCommandHelper from "../../../src/background/command/BufferCommandHelper";
import MockLastSelectedTabRepository from "../mock/MockLastSelectedTabRepository";
import defaultTab from "../mock/defaultTab";
import { describe, beforeEach, it, vi, expect } from "vitest";

describe("BufferCommand", () => {
  const lastSelectedTabRepository = new MockLastSelectedTabRepository();
  const bufferCommandHelper = new BufferCommandHelper(
    lastSelectedTabRepository,
  );
  const sut = new BufferCommand(lastSelectedTabRepository, bufferCommandHelper);

  const mockGetLastSelectedTab = vi.spyOn(
    lastSelectedTabRepository,
    "getLastSelectedTabId",
  );
  const mockTabsQuery = vi.spyOn(chrome.tabs, "query");
  const mockTabsUpdate = vi.spyOn(chrome.tabs, "update");
  const mockHelperQueryTabs = vi.spyOn(bufferCommandHelper, "queryTabs");

  const tab1 = { ...defaultTab, id: 10, index: 0 };
  const tab2 = { ...defaultTab, id: 11, index: 1 };
  const tab3 = { ...defaultTab, id: 12, index: 2 };
  const tab4 = { ...defaultTab, id: 13, index: 3 };
  const tab5 = { ...defaultTab, id: 14, index: 4 };
  const allTabs = [tab1, tab2, tab3, tab4, tab5];
  const ctx = { sender: { tabId: 10, frameId: 0, tab: tab1 } };

  beforeEach(() => {
    mockGetLastSelectedTab.mockClear();
    mockTabsQuery.mockClear();
    mockTabsUpdate.mockClear();
    mockHelperQueryTabs.mockClear();

    mockTabsUpdate.mockImplementation(() => Promise.resolve({}));
  });

  describe("exec", () => {
    it("selects a tab by number", async () => {
      mockTabsQuery.mockResolvedValue(allTabs);
      await sut.exec(ctx, false, "3");

      expect(mockTabsUpdate).toHaveBeenCalledWith(12, { active: true });
    });

    it("throws an error when the number is out of range", async () => {
      mockTabsQuery.mockResolvedValue(allTabs);

      await expect(sut.exec(ctx, false, "0")).rejects.toThrow(RangeError);
      await expect(sut.exec(ctx, false, "6")).rejects.toThrow(RangeError);

      expect(mockTabsUpdate).toHaveBeenCalledTimes(0);
    });

    it("selects last selected tab by #", async () => {
      mockTabsQuery.mockResolvedValue(allTabs);
      mockGetLastSelectedTab.mockResolvedValue(10);
      await sut.exec(ctx, false, "#");

      expect(mockTabsUpdate).toHaveBeenCalledWith(10, { active: true });
    });

    it("do nothing by %", async () => {
      mockTabsQuery.mockResolvedValue(allTabs);
      await sut.exec(ctx, false, "%");

      expect(mockTabsUpdate).toHaveBeenCalledTimes(0);
    });

    it("selects first matched tab by the keyword", async () => {
      mockTabsQuery.mockImplementation((params) => {
        if (params.active) {
          return Promise.resolve([tab1]);
        }
        return Promise.resolve(allTabs);
      });
      mockHelperQueryTabs.mockResolvedValue([tab3, tab4, tab5]);

      await sut.exec(ctx, false, "any");

      expect(mockTabsUpdate).toHaveBeenCalledWith(tab3.id, { active: true });
    });

    it("selects next matched tab by the keyword", async () => {
      mockTabsQuery.mockImplementation((params) => {
        if (params.active) {
          return Promise.resolve([tab3]);
        }
        return Promise.resolve(allTabs);
      });
      mockHelperQueryTabs.mockResolvedValue([tab3, tab4, tab5]);

      await sut.exec(ctx, false, "any");

      expect(mockTabsUpdate).toHaveBeenCalledWith(tab4.id, { active: true });
    });

    it("selects matched tab by the keyword, circularly", async () => {
      mockTabsQuery.mockImplementation((params) => {
        if (params.active) {
          return Promise.resolve([tab5]);
        }
        return Promise.resolve(allTabs);
      });
      mockHelperQueryTabs.mockResolvedValue([tab3, tab4, tab5]);

      await sut.exec(ctx, false, "any");

      expect(mockTabsUpdate).toHaveBeenCalledWith(tab3.id, { active: true });
    });

    it("throws an error when no maching tabs", async () => {
      mockHelperQueryTabs.mockResolvedValue([]);

      await expect(sut.exec(ctx, false, "any")).rejects.toThrow(RangeError);
    });
  });
});
