import ZoomInOperator from "../../../../src/background/operators/impls/ZoomInOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";

describe("ZoomInOperator", () => {
  describe("#run", () => {
    it("zoom-out the current tab", async () => {
      jest.spyOn(chrome.tabs, "getZoom").mockResolvedValue(1);
      const mockSetZoom = jest
        .spyOn(chrome.tabs, "setZoom")
        .mockImplementation(() => Promise.resolve());

      const sut = new ZoomInOperator();
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(mockSetZoom).toHaveBeenCalledWith(100, 1.1);
    });
  });
});
