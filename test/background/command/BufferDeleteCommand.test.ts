import BufferDeleteCommand from "../../../src/background/command/BufferDeleteCommand";
import TabFilter from "../../../src/background/command/TabFilter";

class MockTabFilter implements TabFilter {
  async getByKeyword(_keyword: string): Promise<browser.tabs.Tab[]> {
    throw new Error("not implemented");
  }
}

describe("BufferDeleteCommand", () => {
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

  it("removes a unpinned tab", async () => {
    mockGetByKeyword.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
    ]);

    const cmd = new BufferDeleteCommand(tabFilter);
    await cmd.exec(false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(11);
  });

  it("removes a pinned tab forcely", async () => {
    mockGetByKeyword.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
    ]);

    const cmd = new BufferDeleteCommand(tabFilter);
    await cmd.exec(true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(10);
  });

  it("fails to remove multiple tabs", async () => {
    mockGetByKeyword.mockResolvedValue([
      { id: 10, pinned: false, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
    ]);

    const cmd = new BufferDeleteCommand(tabFilter);

    await expect(cmd.exec(false, "")).rejects.toThrowError(
      "More than one match"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });

  it("fails no matching tabs", async () => {
    mockGetByKeyword.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
    ]);

    const cmd = new BufferDeleteCommand(tabFilter);

    await expect(cmd.exec(false, "")).rejects.toThrowError(
      "No matching buffer"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
