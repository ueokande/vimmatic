import BufferDeleteCommand from "../../../src/background/command/BufferDeleteCommand";
import BufferCommandHelper from "../../../src/background/command/BufferCommandHelper";
import { CommandContext } from "../../../src/background/command/Command";
import defaultTab from "../mock/defaultTab";

describe("BufferDeleteCommand", () => {
  const lastSelectedTab = {
    get: () => {
      throw new Error("not implemented");
    },
  };
  const bufferCommandHelper = new BufferCommandHelper(lastSelectedTab);
  const sut = new BufferDeleteCommand(bufferCommandHelper);

  const mockTabsQuery = jest.spyOn(chrome.tabs, "query");
  const mockTabsRemove = jest.spyOn(chrome.tabs, "remove");

  const ctx = {} as CommandContext;

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockTabsRemove.mockClear();

    mockTabsRemove.mockResolvedValue();
  });

  it("removes an unpinned tab", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: true },
      { ...defaultTab, id: 11, pinned: false },
    ]);

    await sut.exec(ctx, false, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(11);
  });

  it("removes a pinned tab forcely", async () => {
    mockTabsQuery.mockResolvedValue([{ ...defaultTab, id: 10, pinned: true }]);

    await sut.exec(ctx, true, "");

    expect(mockTabsRemove).toHaveBeenCalledWith(10);
  });

  it("fails to remove multiple tabs", async () => {
    mockTabsQuery.mockResolvedValue([
      { ...defaultTab, id: 10, pinned: false },
      { ...defaultTab, id: 11, pinned: false },
    ]);

    await expect(sut.exec(ctx, false, "")).rejects.toThrowError(
      "More than one match"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });

  it("fails no matching tabs", async () => {
    mockTabsQuery.mockResolvedValue([{ ...defaultTab, id: 10, pinned: true }]);

    await expect(sut.exec(ctx, false, "")).rejects.toThrowError(
      "No matching buffer"
    );
    expect(mockTabsRemove).toHaveBeenCalledTimes(0);
  });
});
