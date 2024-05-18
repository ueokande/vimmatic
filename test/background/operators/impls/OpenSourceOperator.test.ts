import OpenSourceOperator from "../../../../src/background/operators/impls/OpenSourceOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, it, expect, vi } from "vitest";

describe("OpenSourceOperator", () => {
  describe("#run", () => {
    const mockTabsCreate = vi
      .spyOn(chrome.tabs, "create")
      .mockImplementation(() => Promise.resolve({}));

    it("opens view-source URL of the current tab", async () => {
      const ctx = {
        sender: {
          tab: { id: 100, url: "https://example.com/" } as chrome.tabs.Tab,
        },
      } as OperatorContext;
      const sut = new OpenSourceOperator();
      await sut.run(ctx);

      expect(mockTabsCreate).toHaveBeenCalledWith({
        url: "view-source:https://example.com/",
      });
    });
  });
});
