import { describe, expect, it, vi } from "vitest";
import { ZoomOutOperator } from "../../../../src/background/operators/impls/ZoomOutOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { asAsyncSpy } from "../../../asAsyncSpy";

describe("ZoomOutOperator", () => {
  describe("#run", () => {
    it("zoom-in the current tab", async () => {
      asAsyncSpy<[number], number>(
        vi.spyOn(chrome.tabs, "getZoom"),
      ).mockResolvedValue(1);
      const mockSetZoom = vi
        .spyOn(chrome.tabs, "setZoom")
        .mockImplementation(() => Promise.resolve());

      const sut = new ZoomOutOperator();
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(mockSetZoom).toHaveBeenCalledWith(100, 0.9);
    });
  });
});
