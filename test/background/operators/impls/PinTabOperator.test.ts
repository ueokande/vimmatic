import PinTabOperator from "../../../../src/background/operators/impls/PinTabOperator";

describe("PinTabOperator", () => {
  describe("#run", () => {
    it("make pinned to the current tab", async () => {
      const mockTabsUpdate = jest
        .spyOn(browser.tabs, "update")
        .mockResolvedValue({} as browser.tabs.Tab);

      const sut = new PinTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith({ pinned: true });
    });
  });
});
