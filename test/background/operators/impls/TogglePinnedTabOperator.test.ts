import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("TogglePinnedTabOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(browser.tabs, "update")
    .mockResolvedValue({} as browser.tabs.Tab);

  describe("#run", () => {
    it("toggle pinned to the current tab", async () => {
      const sut = new TogglePinnedTabOperator();
      const ctx = {
        sender: { tab: { id: 100, pinned: true } },
      } as RequestContext;
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({ pinned: false });
    });
  });
});
