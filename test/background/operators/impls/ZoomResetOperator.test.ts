import ZoomResetOperator from "../../../../src/background/operators/impls/ZoomResetOperator";
import { describe, it, expect, vi } from "vitest";

describe("ResetZoomOperator", () => {
  describe("#run", () => {
    it("resets zoom on the tab", async () => {
      const mockSetZoom = vi
        .spyOn(chrome.tabs, "setZoom")
        .mockImplementation(() => Promise.resolve());

      const sut = new ZoomResetOperator();
      await sut.run();

      expect(mockSetZoom).toHaveBeenCalledWith(0);
    });
  });
});
