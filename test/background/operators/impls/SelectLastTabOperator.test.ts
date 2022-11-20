import SelectLastTabOperator from "../../../../src/background/operators/impls/SelectLastTabOperator";

describe("SelectLastTabOperator", () => {
  const props = {
    highlighted: false,
    incognito: false,
    pinned: false,
  };
  jest.spyOn(browser.tabs, "query").mockResolvedValue([
    { ...props, id: 101, index: 0, active: false },
    { ...props, id: 102, index: 1, active: true },
    { ...props, id: 103, index: 2, active: false },
  ]);

  const mockTabsUpdate = jest
    .spyOn(browser.tabs, "update")
    .mockResolvedValue({} as any);

  describe("#run", () => {
    it("select the rightmost tab", async () => {
      const sut = new SelectLastTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(103, { active: true });
    });
  });
});
