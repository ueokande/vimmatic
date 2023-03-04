import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("TogglePinnedTabOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(browser.tabs, "update")
    .mockResolvedValue({} as browser.tabs.Tab);

  describe("#run", () => {
    it("toggle pinned to the current tab", async () => {
      const sut = new TogglePinnedTabOperator();
      const ctx = {
        sender: { tab: { id: 100, pinned: true } },
      } as OperatorContext;
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({ pinned: false });
    });
  });
});
