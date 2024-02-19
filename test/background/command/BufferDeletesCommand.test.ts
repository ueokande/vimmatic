import BufferDeletesCommand from "../../../src/background/command/BufferDeletesCommand";
import BufferCommandHelper from "../../../src/background/command/BufferCommandHelper";
import defaultTab from "../mock/defaultTab";

describe("BufferDeletesCommand", () => {
  const lastSelectedTab = {
    get: () => {
      throw new Error("not implemented");
    },
  };
  const bufferCommandHelper = new BufferCommandHelper(lastSelectedTab);
  const sut = new BufferDeletesCommand(bufferCommandHelper);

  const mockTabsQuery = jest.spyOn(chrome.tabs, "query");
  const mockTabsRemove = jest.spyOn(chrome.tabs, "remove");

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

    mockTabsRemove.mockResolvedValue();
  });

  it("removes unpinned tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: true },
      { ...defaultTab, id: 11, pinned: false },
      { ...defaultTab, id: 12, pinned: true },
      { ...defaultTab, id: 13, pinned: false },
    ]);

    await sut.exec(ctx, false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([11, 13]);
  });

  it("removes pinned tabs forcely", async () => {
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
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: true },
      { ...defaultTab, id: 11, pinned: true },
    ]);

    await expect(sut.exec(ctx, false, "")).rejects.toThrow(
      "No matching buffer",
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
