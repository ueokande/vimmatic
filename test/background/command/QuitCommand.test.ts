import { QuitCommand } from "../../../src/background/command/QuitCommand";
import { defaultTab } from "../mock/defaultTab";
import { describe, expect, beforeEach, it, vi } from "vitest";

describe("QuitCommand", () => {
  const mockTabsQuery = vi.spyOn(chrome.tabs, "query");
  const mockTabsRemove = vi.spyOn(chrome.tabs, "remove");

  const pinned = {
    ...defaultTab,
    id: 10,
    pinned: true,
  } as chrome.tabs.Tab;
  const unpinned = {
    id: 10,
    pinned: false,
  } as chrome.tabs.Tab;

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockImplementation(() => Promise.resolve());
  });

  it("removes unpinned tab", async () => {
    mockTabsQuery.mockResolvedValue([unpinned]);
    const cmd = new QuitCommand();
    const ctx = { sender: { tabId: 10, frameId: 0, tab: unpinned } };
    await cmd.exec(ctx, false, "");

    expect(mockTabsRemove).toHaveBeenCalledTimes(1);
    expect(mockTabsRemove).toHaveBeenCalledWith(10);
  });

  it("fails to remove pinned tab", async () => {
    mockTabsQuery.mockResolvedValue([pinned]);
    const ctx = { sender: { tabId: 10, frameId: 0, tab: pinned } };
    const cmd = new QuitCommand();

    await expect(cmd.exec(ctx, false, "")).rejects.toThrow("Cannot close");
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });

  it("removes pinned tab forcely", async () => {
    mockTabsQuery.mockResolvedValue([pinned]);
    const cmd = new QuitCommand();
    const ctx = { sender: { tabId: 10, frameId: 0, tab: pinned } };
    await cmd.exec(ctx, true, "");

    expect(mockTabsRemove).toHaveBeenCalledTimes(1);
    expect(mockTabsRemove).toHaveBeenCalledWith(10);
  });
});
