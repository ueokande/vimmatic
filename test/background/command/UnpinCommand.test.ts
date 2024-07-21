import { UnpinCommand } from "../../../src/background/command/UnpinCommand";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { TabQueryHelper } from "../../../src/background/command/TabQueryHelper";
import { defaultTab } from "../mock/defaultTab";
import { describe, expect, vi, test, beforeEach } from "vitest";

const tabs = [
  {
    ...defaultTab,
    id: 1,
    title: "example1",
  },
  {
    ...defaultTab,
    id: 2,
    title: "example2",
  },
  {
    ...defaultTab,
    id: 3,
    title: "example3",
  },
];
const ctx = {
  sender: {
    tabId: 10,
    frameId: 0,
    tab: {
      ...defaultTab,
      id: 10,
      title: "example",
    },
  },
};

describe("UnpinCommand", () => {
  const consoleClient = new MockConsoleClient();
  const mockShowInfo = vi.spyOn(consoleClient, "showInfo").mockResolvedValue();
  const lastSelectedTab = {
    getLastSelectedTabId(): Promise<number | undefined> {
      throw new Error("not implemented");
    },
    setCurrentTabId(): Promise<void> {
      throw new Error("not implemented");
    },
  };
  const tabQueryHelper = new TabQueryHelper(lastSelectedTab);
  const mockTabUpdate = vi.spyOn(chrome.tabs, "update").mockResolvedValue();
  const mockTabQuery = vi.spyOn(chrome.tabs, "query");

  beforeEach(() => {
    mockTabUpdate.mockClear();
    mockShowInfo.mockClear();
  });

  test("unpins the current tab", async () => {
    mockTabQuery.mockResolvedValueOnce(tabs);
    const cmd = new UnpinCommand(tabQueryHelper, consoleClient);
    await cmd.exec(ctx, false, "");

    expect(mockTabUpdate).toHaveBeenCalledWith(10, { pinned: false });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });

  test("unpins the matched tab", async () => {
    mockTabQuery.mockResolvedValueOnce(tabs);
    const cmd = new UnpinCommand(tabQueryHelper, consoleClient);
    await cmd.exec(ctx, false, "example2");

    expect(mockTabUpdate).toHaveBeenCalledWith(2, { pinned: false });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });

  test("throws an error if no tab is matched", async () => {
    mockTabQuery.mockResolvedValueOnce(tabs);
    const cmd = new UnpinCommand(tabQueryHelper, consoleClient);
    await expect(() => cmd.exec(ctx, false, "example5")).rejects.toThrowError(
      "No matching buffer for example5",
    );
  });
});
