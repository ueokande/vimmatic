import CloseTabRightOperator from "../../../../src/background/operators/impls/CloseTabRightOperator";
import defaultTab from "../../mock/defaultTab";

describe("CloseTabRightOperator", () => {
  describe("#run", () => {
    const mockTabsRemove = jest
      .spyOn(chrome.tabs, "remove")
      .mockResolvedValue();

    it("close the right of the current tab", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, active: false },
        { ...defaultTab, id: 102, index: 1, active: true },
        { ...defaultTab, id: 103, index: 2, active: false },
        { ...defaultTab, id: 104, index: 3, active: false },
      ];
      jest.spyOn(chrome.tabs, "query").mockImplementation(({ active }) => {
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
