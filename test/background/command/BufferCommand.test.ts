import BufferCommand from "../../../src/background/command/BufferCommand";
import TabFilter from "../../../src/background/command/TabFilter";
import LastSelectedTab from "../../../src/background/command/LastSelectedTab";

class MockTabFilter implements TabFilter {
  async getByKeyword(_keyword: string): Promise<browser.tabs.Tab[]> {
    throw new Error("not implemented");
  }
}

class MockLastSelectedTab implements LastSelectedTab {
  get(): Promise<number> {
    throw new Error("not implemented");
  }
}

describe("BufferCommand", () => {
  const tabFilter = new MockTabFilter();
  const lastSelectedTab = new MockLastSelectedTab();

  const mockGetByKeyword = jest.spyOn(tabFilter, "getByKeyword");
  const mockGetLastSelectedTab = jest.spyOn(lastSelectedTab, "get");
  const mockTabsQuery = jest.spyOn(browser.tabs, "query");
  const mockTabsUpdate = jest.spyOn(browser.tabs, "update");

  const props = {
    highlighted: false,
    active: false,
    incognito: false,
    pinned: false,
  };
  const tab1 = { id: 10, index: 0, ...props };
  const tab2 = { id: 11, index: 1, ...props };
  const tab3 = { id: 12, index: 2, ...props };
  const tab4 = { id: 13, index: 3, ...props };
  const tab5 = { id: 14, index: 4, ...props };
  const allTabs = [tab1, tab2, tab3, tab4, tab5];

  beforeEach(() => {
    mockGetByKeyword.mockClear();
    mockGetLastSelectedTab.mockClear();
    mockTabsQuery.mockClear();
    mockTabsUpdate.mockClear();

    mockTabsUpdate.mockResolvedValue({} as any);
  });

  it("selects a tab by number", async () => {
    mockTabsQuery.mockResolvedValue(allTabs);
    const cmd = new BufferCommand(tabFilter, lastSelectedTab);
    await cmd.exec(false, "3");

    expect(mockTabsUpdate).toBeCalledWith(12, { active: true });
  });

  it("throws an error when the number is out of range", async () => {
    mockTabsQuery.mockResolvedValue(allTabs);
    const cmd = new BufferCommand(tabFilter, lastSelectedTab);

    await expect(cmd.exec(false, "0")).rejects.toThrow(RangeError);
    await expect(cmd.exec(false, "6")).rejects.toThrow(RangeError);

    expect(mockTabsUpdate).toBeCalledTimes(0);
  });

  it("selects last selected tab by #", async () => {
    mockTabsQuery.mockResolvedValue(allTabs);
    mockGetLastSelectedTab.mockResolvedValue(10);
    const cmd = new BufferCommand(tabFilter, lastSelectedTab);
    await cmd.exec(false, "#");

    expect(mockTabsUpdate).toBeCalledWith(10, { active: true });
  });

  it("do nothing by %", async () => {
    mockTabsQuery.mockResolvedValue(allTabs);
    const cmd = new BufferCommand(tabFilter, lastSelectedTab);
    await cmd.exec(false, "%");

    expect(mockTabsUpdate).toBeCalledTimes(0);
  });

  it("selects first matched tab by the keyword", async () => {
    mockTabsQuery.mockImplementation((params) => {
      if (params.active) {
        return Promise.resolve([tab1]);
      }
      return Promise.resolve(allTabs);
    });
    mockGetByKeyword.mockResolvedValue([tab3, tab4, tab5]);

    const cmd = new BufferCommand(tabFilter, lastSelectedTab);
    await cmd.exec(false, "any");

    expect(mockTabsUpdate).toBeCalledWith(tab3.id, { active: true });
  });

  it("selects next matched tab by the keyword", async () => {
    mockTabsQuery.mockImplementation((params) => {
      if (params.active) {
        return Promise.resolve([tab3]);
      }
      return Promise.resolve(allTabs);
    });
    mockGetByKeyword.mockResolvedValue([tab3, tab4, tab5]);

    const cmd = new BufferCommand(tabFilter, lastSelectedTab);
    await cmd.exec(false, "any");

    expect(mockTabsUpdate).toBeCalledWith(tab4.id, { active: true });
  });

  it("selects matched tab by the keyword, circularly", async () => {
    mockTabsQuery.mockImplementation((params) => {
      if (params.active) {
        return Promise.resolve([tab5]);
      }
      return Promise.resolve(allTabs);
    });
    mockGetByKeyword.mockResolvedValue([tab3, tab4, tab5]);

    const cmd = new BufferCommand(tabFilter, lastSelectedTab);
    await cmd.exec(false, "any");

    expect(mockTabsUpdate).toBeCalledWith(tab3.id, { active: true });
  });

  it("throws an error when no maching tabs", async () => {
    mockGetByKeyword.mockResolvedValue([]);

    const cmd = new BufferCommand(tabFilter, lastSelectedTab);

    await expect(cmd.exec(false, "any")).rejects.toThrow(RangeError);
  });
});
