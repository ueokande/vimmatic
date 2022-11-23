import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";

describe("TogglePinnedTabOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(browser.tabs, "update")
    .mockResolvedValue({} as browser.tabs.Tab);

  describe("#run", () => {
    it("toggle pinned to the current tab", async () => {
      const ctx = {
        sender: { tab: { id: 100, pinned: true } as browser.tabs.Tab },
      };
      const sut = new TogglePinnedTabOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({ pinned: false });
    });
  });
});
