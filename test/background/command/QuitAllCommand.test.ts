import QuitAllCommand from "../../../src/background/command/QuitAllCommand";
import defaultTab from "../mock/defaultTab";

describe("QuitAllCommand", () => {
  const mockTabsQuery = jest.spyOn(chrome.tabs, "query");
  const mockTabsRemove = jest.spyOn(chrome.tabs, "remove");

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

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockResolvedValue();
  });

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
