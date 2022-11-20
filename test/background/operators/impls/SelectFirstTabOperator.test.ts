import SelectFirstTabOperator from "../../../../src/background/operators/impls/SelectFirstTabOperator";

describe("SelectFirstTabOperator", () => {
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
    it("select the leftmost tab", async () => {
      const sut = new SelectFirstTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(101, { active: true });
    });
  });
});
