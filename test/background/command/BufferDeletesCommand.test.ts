import BufferDeletesCommand from "../../../src/background/command/BufferDeletesCommand";
import TabFilter from "../../../src/background/command/TabFilter";

class MockTabFilter implements TabFilter {
  async getByKeyword(_keyword: string): Promise<browser.tabs.Tab[]> {
    throw new Error("not implemented");
  }
}

describe("BufferDeletesCommand", () => {
  const tabFilter = new MockTabFilter();
  const mockGetByKeyword = jest.spyOn(tabFilter, "getByKeyword");
  const mockTabsRemove = jest.spyOn(browser.tabs, "remove");

  const defaultTabProps = {
    index: 0,
    highlighted: false,
    active: true,
    incognito: false,
  };

  beforeEach(() => {
    mockGetByKeyword.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockResolvedValue();
  });

  it("removes unpinned tabs", async () => {
    mockGetByKeyword.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
      { id: 12, pinned: true, ...defaultTabProps },
      { id: 13, pinned: false, ...defaultTabProps },
    ]);

    const cmd = new BufferDeletesCommand(tabFilter);
    await cmd.exec(false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([11, 13]);
  });

  it("removes pinned tabs forcely", async () => {
    mockGetByKeyword.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
      { id: 12, pinned: true, ...defaultTabProps },
      { id: 13, pinned: false, ...defaultTabProps },
    ]);

    const cmd = new BufferDeletesCommand(tabFilter);
    await cmd.exec(true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([10, 11, 12, 13]);
  });

  it("fails no matching tabs", async () => {
    mockGetByKeyword.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: true, ...defaultTabProps },
    ]);

    const cmd = new BufferDeletesCommand(tabFilter);

    await expect(cmd.exec(false, "")).rejects.toThrowError(
      "No matching buffer"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
