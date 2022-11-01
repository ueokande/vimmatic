import BufferDeleteCommand from "../../../src/background/command/BufferDeleteCommand";
import BufferCommandHelper from "../../../src/background/command/BufferCommandHelper";

describe("BufferDeleteCommand", () => {
  const lastSelectedTab = {
    get: () => {
      throw new Error("not implemented");
    },
  };
  const bufferCommandHelper = new BufferCommandHelper(lastSelectedTab);
  const sut = new BufferDeleteCommand(bufferCommandHelper);

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

  it("removes a unpinned tab", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
    ]);

    await sut.exec(false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(11);
  });

  it("removes a pinned tab forcely", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
    ]);

    await sut.exec(true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(10);
  });

  it("fails to remove multiple tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: false, ...defaultTabProps },
      { id: 11, pinned: false, ...defaultTabProps },
    ]);

    await expect(sut.exec(false, "")).rejects.toThrowError(
      "More than one match"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });

  it("fails no matching tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { id: 10, pinned: true, ...defaultTabProps },
    ]);

    await expect(sut.exec(false, "")).rejects.toThrowError(
      "No matching buffer"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
