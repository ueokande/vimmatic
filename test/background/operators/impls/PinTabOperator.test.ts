import PinTabOperator from "../../../../src/background/operators/impls/PinTabOperator";

describe("PinTabOperator", () => {
  describe("#run", () => {
    it("make pinned to the current tab", async () => {
      const mockTabsUpdate = jest
        .spyOn(chrome.tabs, "update")
        .mockImplementation(() => Promise.resolve({}));

      const sut = new PinTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith({ pinned: true });
    });
  });
});
