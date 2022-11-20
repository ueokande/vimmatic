import SelectTabPrevOperator from "../../../../src/background/operators/impls/SelectTabPrevOperator";

describe("SelectTabPrevOperator", () => {
  const props = {
    highlighted: false,
    incognito: false,
    pinned: false,
  };
  const mockTabsUpdate = jest
    .spyOn(browser.tabs, "update")
    .mockResolvedValue({} as any);

  beforeEach(() => {
    mockTabsUpdate.mockReset();
  });

  describe("#run", () => {
    it("select a left tab of the current tab", async () => {
      const tabs = [
        { ...props, id: 101, index: 0, active: false },
        { ...props, id: 102, index: 1, active: true },
        { ...props, id: 103, index: 2, active: false },
      ];
      jest.spyOn(browser.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[1]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new SelectTabPrevOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(101, { active: true });
    });
  });

  describe("#run", () => {
    it("select a left tab of the current tab in rotation", async () => {
      const tabs = [
        { ...props, id: 101, index: 0, active: true },
        { ...props, id: 102, index: 1, active: false },
        { ...props, id: 103, index: 2, active: false },
      ];
      jest.spyOn(browser.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[0]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new SelectTabPrevOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(103, { active: true });
    });
  });
});
