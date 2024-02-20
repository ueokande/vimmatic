import SelectLastTabOperator from "../../../../src/background/operators/impls/SelectLastTabOperator";
import defaultTab from "../../mock/defaultTab";

describe("SelectLastTabOperator", () => {
  jest.spyOn(chrome.tabs, "query").mockResolvedValue([
    { ...defaultTab, id: 101, index: 0, active: false },
    { ...defaultTab, id: 102, index: 1, active: true },
    { ...defaultTab, id: 103, index: 2, active: false },
  ]);

  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockImplementation(() => Promise.resolve({}));

  describe("#run", () => {
    it("select the rightmost tab", async () => {
      const sut = new SelectLastTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith(103, { active: true });
    });
  });
});
