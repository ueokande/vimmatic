import QuitAllCommand from "../../../src/background/command/QuitAllCommand";

describe("QuitAllCommand", () => {
  const mockTabsQuery = jest.spyOn(browser.tabs, "query");
  const mockTabsRemove = jest.spyOn(browser.tabs, "remove");

  const defaultTabProps = {
    index: 0,
    highlighted: false,
    active: true,
    incognito: false,
  };

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockResolvedValue();
  });

  it("removes unpinned tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: false, ...defaultTabProps },
      { id: 11, pinned: true, ...defaultTabProps },
      { id: 12, pinned: false, ...defaultTabProps },
      { id: 13, pinned: true, ...defaultTabProps },
    ]);

    const cmd = new QuitAllCommand();
    await cmd.exec(false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([10, 12]);
  });

  it("removes pinned tabs forcely", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: false, ...defaultTabProps },
      { id: 11, pinned: true, ...defaultTabProps },
      { id: 12, pinned: false, ...defaultTabProps },
      { id: 13, pinned: true, ...defaultTabProps },
    ]);

    const cmd = new QuitAllCommand();
    await cmd.exec(true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([10, 11, 12, 13]);
  });
});
