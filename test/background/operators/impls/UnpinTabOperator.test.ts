import UnpinTabOperator from "../../../../src/background/operators/impls/UnpinTabOperator";

describe("UnpinTabOperator", () => {
  describe("#run", () => {
    it("make unpinned to the current tab", async () => {
      const mockTabsUpdate = jest
        .spyOn(chrome.tabs, "update")
        .mockImplementation(() => Promise.resolve({}));

      const sut = new UnpinTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith({ pinned: false });
    });
  });
});
