import UnpinTabOperator from "../../../../src/background/operators/impls/UnpinTabOperator";

describe("UnpinTabOperator", () => {
  describe("#run", () => {
    it("make unpinned to the current tab", async () => {
      const mockTabsUpdate = jest
        .spyOn(browser.tabs, "update")
        .mockResolvedValue({} as browser.tabs.Tab);

      const sut = new UnpinTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith({ pinned: false });
    });
  });
});
