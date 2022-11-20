import DuplicateTabOperator from "../../../../src/background/operators/impls/DuplicateTabOperator";

describe("DuplicateTabOperator", () => {
  describe("#run", () => {
    it("duplicate a tab", async () => {
      jest
        .spyOn(browser.tabs, "query")
        .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);
      const mockTabsDuplicate = jest
        .spyOn(browser.tabs, "duplicate")
        .mockResolvedValue({} as browser.tabs.Tab);

      const sut = new DuplicateTabOperator();
      await sut.run();

      expect(mockTabsDuplicate).toBeCalledWith(100);
    });
  });
});
