import QuitCommand from "../../../src/background/command/QuitCommand";

describe("QuitCommand", () => {
  const mockTabsQuery = jest.spyOn(browser.tabs, "query");
  const mockTabsRemove = jest.spyOn(browser.tabs, "remove");

  const pinned = {
    id: 10,
    index: 0,
    highlighted: false,
    active: true,
    incognito: false,
    pinned: true,
  };
  const unpinned = {
    id: 10,
    index: 0,
    highlighted: false,
    active: true,
    incognito: false,
    pinned: false,
  };

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockResolvedValue();
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

    await expect(cmd.exec(ctx, false, "")).rejects.toThrowError("Cannot close");
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
