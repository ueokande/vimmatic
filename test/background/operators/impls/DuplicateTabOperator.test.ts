import DuplicateTabOperator from "../../../../src/background/operators/impls/DuplicateTabOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, expect, it, vi } from "vitest";

describe("DuplicateTabOperator", () => {
  describe("#run", () => {
    it("duplicate a tab", async () => {
      const mockTabsDuplicate = vi
        .spyOn(chrome.tabs, "duplicate")
        .mockImplementation(() => Promise.resolve({}));

      const sut = new DuplicateTabOperator();
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(mockTabsDuplicate).toHaveBeenCalledWith(100);
    });
  });
});
