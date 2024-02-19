import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("TogglePinnedTabOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockResolvedValue({} as chrome.tabs.Tab);

  describe("#run", () => {
    it("toggle pinned to the current tab", async () => {
      const sut = new TogglePinnedTabOperator();
      const ctx = {
        sender: { tab: { id: 100, pinned: true } },
      } as OperatorContext;
      await sut.run(ctx);

      expect(mockTabsUpdate).toHaveBeenCalledWith({ pinned: false });
    });
  });
});
