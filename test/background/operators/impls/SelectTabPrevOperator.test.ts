import SelectTabPrevOperator from "../../../../src/background/operators/impls/SelectTabPrevOperator";
import defaultTab from "../../mock/defaultTab";

describe("SelectTabPrevOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockImplementation(() => Promise.resolve({}));

  beforeEach(() => {
    mockTabsUpdate.mockReset();
  });

  describe("#run", () => {
    it("select a left tab of the current tab", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, active: false },
        { ...defaultTab, id: 102, index: 1, active: true },
        { ...defaultTab, id: 103, index: 2, active: false },
      ];
      jest.spyOn(chrome.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[1]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new SelectTabPrevOperator();
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith(101, { active: true });
    });
  });

  describe("#run", () => {
    it("select a left tab of the current tab in rotation", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, active: true },
        { ...defaultTab, id: 102, index: 1, active: false },
        { ...defaultTab, id: 103, index: 2, active: false },
      ];
      jest.spyOn(chrome.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[0]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new SelectTabPrevOperator();
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith(103, { active: true });
    });
  });
});
