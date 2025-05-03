import { TogglePinCommand } from "../../../src/background/command/TogglePinCommand";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { TabQueryHelper } from "../../../src/background/command/TabQueryHelper";
import { defaultTab } from "../mock/defaultTab";
import { describe, expect, vi, test } from "vitest";

const tabs = [
  {
    ...defaultTab,
    id: 1,
    title: "example1",
    pinned: false,
  },
  {
    ...defaultTab,
    id: 2,
    title: "example2",
    pinned: false,
  },
  {
    ...defaultTab,
    id: 3,
    title: "example3",
    pinned: true,
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

describe("TogglePinCommand", () => {
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

  test("toggle pinning the current tab", async () => {
    mockTabQuery.mockResolvedValueOnce(tabs);
    const cmd = new TogglePinCommand(tabQueryHelper, consoleClient);
    await cmd.exec(ctx, false, "");

    expect(mockTabUpdate).toHaveBeenCalledWith(10, { pinned: true });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });

  test("toogle pinning the matched tab", async () => {
    mockTabQuery.mockResolvedValueOnce(tabs);
    const cmd = new TogglePinCommand(tabQueryHelper, consoleClient);

    await cmd.exec(ctx, false, "example2");
    await cmd.exec(ctx, false, "example3");

    expect(mockTabUpdate).toHaveBeenCalledWith(2, { pinned: true });
    expect(mockTabUpdate).toHaveBeenCalledWith(3, { pinned: false });
    expect(mockShowInfo).toHaveBeenCalledTimes(2);
  });

  test("throws an error if no tab is matched", async () => {
    mockTabQuery.mockResolvedValueOnce(tabs);
    const cmd = new TogglePinCommand(tabQueryHelper, consoleClient);
    await expect(() => cmd.exec(ctx, false, "example5")).rejects.toThrowError(
      "No matching buffer for example5",
    );
  });
});
