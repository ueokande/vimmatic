import BufferDeleteCommand from "../../../src/background/command/BufferDeleteCommand";
import BufferCommandHelper from "../../../src/background/command/BufferCommandHelper";
import type { CommandContext } from "../../../src/background/command/types";
import defaultTab from "../mock/defaultTab";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("BufferDeleteCommand", () => {
  const lastSelectedTab = {
    getLastSelectedTabId(): Promise<number | undefined> {
      throw new Error("not implemented");
    },
    setCurrentTabId(): Promise<void> {
      throw new Error("not implemented");
    },
  };
  const bufferCommandHelper = new BufferCommandHelper(lastSelectedTab);
  const sut = new BufferDeleteCommand(bufferCommandHelper);

  const mockTabsQuery = vi.spyOn(chrome.tabs, "query");
  const mockTabsRemove = vi.spyOn(chrome.tabs, "remove");

  const ctx = {} as CommandContext;

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockImplementation(() => Promise.resolve());
  });

  it("removes an unpinned tab", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: true },
      { ...defaultTab, id: 11, pinned: false },
    ]);

    await sut.exec(ctx, false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(11);
  });

  it("removes a pinned tab forcely", async () => {
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
    mockTabsQuery.mockResolvedValue([{ ...defaultTab, id: 10, pinned: true }]);

    await expect(sut.exec(ctx, false, "")).rejects.toThrow(
      "No matching buffer",
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
