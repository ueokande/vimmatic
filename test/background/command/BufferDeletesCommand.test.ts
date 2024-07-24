import { BufferDeletesCommand } from "../../../src/background/command/BufferDeletesCommand";
import { TabQueryHelper } from "../../../src/background/command/TabQueryHelper";
import { defaultTab } from "../mock/defaultTab";
import { describe, expect, beforeEach, vi, it } from "vitest";

describe("BufferDeletesCommand", () => {
  const lastSelectedTab = {
    getLastSelectedTabId(): Promise<number | undefined> {
      throw new Error("not implemented");
    },
    setCurrentTabId(): Promise<void> {
      throw new Error("not implemented");
    },
  };
  const tabQueryHelper = new TabQueryHelper(lastSelectedTab);
  const sut = new BufferDeletesCommand(tabQueryHelper);

  const mockTabsQuery = vi.spyOn(chrome.tabs, "query");
  const mockTabsRemove = vi.spyOn(chrome.tabs, "remove");

  const ctx = {
    sender: {
      tabId: 10,
      frameId: 0,
      tab: { ...defaultTab, id: 10, pinned: true },
    },
  };

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockImplementation(() => Promise.resolve());
  });

  it("removes tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: true },
      { ...defaultTab, id: 11, pinned: false },
      { ...defaultTab, id: 12, pinned: true },
      { ...defaultTab, id: 13, pinned: false },
    ]);

    await sut.exec(ctx, true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([10, 11, 12, 13]);
  });

  it("fails no matching tabs", async () => {
    mockTabsQuery.mockResolvedValue([]);

    await expect(sut.exec(ctx, false, "")).rejects.toThrow(
      "No matching buffer",
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
