import BufferDeletesCommand from "../../../src/background/command/BufferDeletesCommand";
import BufferCommandHelper from "../../../src/background/command/BufferCommandHelper";

describe("BufferDeletesCommand", () => {
  const lastSelectedTab = {
    get: () => {
      throw new Error("not implemented");
    },
  };
  const bufferCommandHelper = new BufferCommandHelper(lastSelectedTab);
  const sut = new BufferDeletesCommand(bufferCommandHelper);

  const mockTabsQuery = jest.spyOn(browser.tabs, "query");
  const mockTabsRemove = jest.spyOn(browser.tabs, "remove");

  const defaultTabProps = {
    index: 0,
    highlighted: false,
    active: true,
    title: "title",
    url: "https://example.com",
    incognito: false,
  };

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockResolvedValue();
  });

  it("removes unpinned tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
      { id: 12, pinned: true, ...defaultTabProps },
      { id: 13, pinned: false, ...defaultTabProps },
    ]);

    await sut.exec(false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([11, 13]);
  });

  it("removes pinned tabs forcely", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
      { id: 12, pinned: true, ...defaultTabProps },
      { id: 13, pinned: false, ...defaultTabProps },
    ]);

    await sut.exec(true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith([10, 11, 12, 13]);
  });

  it("fails no matching tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: true, ...defaultTabProps },
    ]);

    await expect(sut.exec(false, "")).rejects.toThrowError(
      "No matching buffer"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
