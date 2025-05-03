import { QuitAllCommand } from "../../../src/background/command/QuitAllCommand";
import { defaultTab } from "../mock/defaultTab";
import { describe, it, vi, expect } from "vitest";

describe("QuitAllCommand", () => {
  const mockTabsQuery = vi.spyOn(chrome.tabs, "query");
  const mockTabsRemove = vi
    .spyOn(chrome.tabs, "remove")
    .mockImplementation(() => Promise.resolve());

  const ctx = {
    sender: {
      tabId: 10,
      frameId: 0,
      tab: {
        ...defaultTab,
        id: 10,
        pinned: true,
      },
    },
  };

  it("removes unpinned tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: false },
      { ...defaultTab, id: 11, pinned: true },
      { ...defaultTab, id: 12, pinned: false },
      { ...defaultTab, id: 13, pinned: true },
    ]);

    const cmd = new QuitAllCommand();
    await cmd.exec(ctx, false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([10, 12]);
  });

  it("removes pinned tabs forcely", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: false },
      { ...defaultTab, id: 11, pinned: true },
      { ...defaultTab, id: 12, pinned: false },
      { ...defaultTab, id: 13, pinned: true },
    ]);

    const cmd = new QuitAllCommand();
    await cmd.exec(ctx, true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([10, 11, 12, 13]);
  });
});
