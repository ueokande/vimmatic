import CloseTabOperator from "../../../../src/background/operators/impls/CloseTabOperator";

describe("CloseTabOperator", () => {
  const tab = {
    highlighted: false,
    active: true,
    incognito: false,
  };
  const mockTabsRemove = jest.spyOn(browser.tabs, "remove");
  const mockTabsUpdate = jest.spyOn(browser.tabs, "update");

  mockTabsRemove.mockResolvedValue();
  mockTabsUpdate.mockResolvedValue({} as any);

  beforeEach(() => {
    mockTabsRemove.mockClear();
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("close a current tab", async () => {
      jest.spyOn(browser.tabs, "query").mockResolvedValue([
        {
          ...tab,
          id: 100,
          index: 0,
          pinned: false,
        },
      ]);

      const sut = new CloseTabOperator();
      await sut.run();

      expect(mockTabsRemove).toBeCalledWith(100);
    });

    it("close a current tab forcely", async () => {
      jest.spyOn(browser.tabs, "query").mockResolvedValue([
        {
          ...tab,
          id: 100,
          index: 0,
          pinned: true,
        },
      ]);

      const sut = new CloseTabOperator(true);
      await sut.run();

      expect(mockTabsRemove).toBeCalledWith(100);
    });

    it("close a current tab and select left of the closed tab", async () => {
      const tabs = [
        { ...tab, id: 101, index: 0, pinned: false, active: false },
        { ...tab, id: 102, index: 1, pinned: false, active: true },
        { ...tab, id: 103, index: 2, pinned: false, active: false },
      ];
      jest.spyOn(browser.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[1]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new CloseTabOperator(false, true);
      await sut.run();

      expect(mockTabsRemove).toBeCalledWith(102);
      expect(mockTabsUpdate).toBeCalledWith(101, { active: true });
    });
  });
});
