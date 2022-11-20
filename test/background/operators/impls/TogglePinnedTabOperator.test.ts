import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";

describe("TogglePinnedTabOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(browser.tabs, "update")
    .mockResolvedValue({} as browser.tabs.Tab);
  jest
    .spyOn(browser.tabs, "query")
    .mockResolvedValue([{ id: 100, pinned: true } as browser.tabs.Tab]);

  describe("#run", () => {
    it("toggle pinned to the current tab", async () => {
      const sut = new TogglePinnedTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(100, { pinned: false });
    });
  });
});
