import { NavigateRootOperator } from "../../../../src/background/operators/impls/NavigateRootOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, it, expect, vi } from "vitest";

describe("NavigateRootOperator", () => {
  describe("#run", () => {
    it("opens root directory in the URL", async () => {
      const mockTabsUpdate = vi
        .spyOn(chrome.tabs, "update")
        .mockImplementation(() => Promise.resolve({}));

      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/banana",
          },
        },
      } as OperatorContext;
      const sut = new NavigateRootOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toHaveBeenCalledWith({
        url: "https://example.com",
      });
    });
  });
});
