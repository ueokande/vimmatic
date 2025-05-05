import { BufferDeleteCommand } from "../../../src/background/command/BufferDeleteCommand";
import { TabQueryHelper } from "../../../src/background/command/TabQueryHelper";
import type { CommandContext } from "../../../src/background/command/types";
import { defaultTab } from "../mock/defaultTab";
import { describe, it, expect, vi } from "vitest";

describe("BufferDeleteCommand", () => {
  const lastSelectedTab = {
    getLastSelectedTabId(): Promise<number | undefined> {
      throw new Error("not implemented");
    },
    setCurrentTabId(): Promise<void> {
      throw new Error("not implemented");
    },
  };
  const tabQueryHelper = new TabQueryHelper(lastSelectedTab);
  const sut = new BufferDeleteCommand(tabQueryHelper);

  const mockTabsQuery = vi.spyOn(chrome.tabs, "query");
  const mockTabsRemove = vi
    .spyOn(chrome.tabs, "remove")
    .mockImplementation(() => Promise.resolve());

  const ctx = {} as CommandContext;

  it("removes a tab", async () => {
    mockTabsQuery.mockResolvedValue([{ ...defaultTab, id: 10, pinned: true }]);

    await sut.exec(ctx, true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(10);
  });

  it("fails to remove multiple tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: false },
      { ...defaultTab, id: 11, pinned: false },
    ]);

    await expect(sut.exec(ctx, false, "")).rejects.toThrow(
      "More than one match",
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });

  it("fails no matching tabs", async () => {
    mockTabsQuery.mockResolvedValue([]);

    await expect(sut.exec(ctx, false, "")).rejects.toThrow(
      "No matching buffer",
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
