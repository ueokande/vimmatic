import CloseTabRightOperator from "../../../../src/background/operators/impls/CloseTabRightOperator";

describe("CloseTabRightOperator", () => {
  describe("#run", () => {
    const tab = {
      highlighted: false,
      incognito: false,
      pinned: false,
    };
    const mockTabsRemove = jest
      .spyOn(browser.tabs, "remove")
      .mockResolvedValue();

    it("close the right of the current tab", async () => {
      const tabs = [
        { ...tab, id: 101, index: 0, active: false },
        { ...tab, id: 102, index: 1, active: true },
        { ...tab, id: 103, index: 2, active: false },
        { ...tab, id: 104, index: 3, active: false },
      ];
      jest.spyOn(browser.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[2]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new CloseTabRightOperator();
      await sut.run();

      expect(mockTabsRemove).toBeCalledWith([103, 104]);
    });
  });
});
