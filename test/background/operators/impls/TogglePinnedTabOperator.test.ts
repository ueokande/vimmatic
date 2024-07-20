import { TogglePinnedTabOperator } from "../../../../src/background/operators/impls/TogglePinnedTabOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, it, expect, vi } from "vitest";

describe("TogglePinnedTabOperator", () => {
  const mockTabsUpdate = vi
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
