import SelectTabNextOperator from "../../../../src/background/operators/impls/SelectTabNextOperator";
import defaultTab from "../../mock/defaultTab";

describe("SelectTabNextOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockResolvedValue({} as any);

  beforeEach(() => {
    mockTabsUpdate.mockReset();
  });

  describe("#run", () => {
    it("select a right tab of the current tab", async () => {
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

      const sut = new SelectTabNextOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(103, { active: true });
    });
  });

  describe("#run", () => {
    it("select a right tab of the current tab in rotation", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, active: false },
        { ...defaultTab, id: 102, index: 1, active: false },
        { ...defaultTab, id: 103, index: 2, active: true },
      ];
      jest.spyOn(chrome.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[2]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new SelectTabNextOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(101, { active: true });
    });
  });
});
