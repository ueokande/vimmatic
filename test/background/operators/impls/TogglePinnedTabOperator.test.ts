import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";

describe("TogglePinnedTabOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockImplementation(() => Promise.resolve({}));

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
