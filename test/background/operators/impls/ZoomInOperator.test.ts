import ZoomInOperator from "../../../../src/background/operators/impls/ZoomInOperator";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("ZoomInOperator", () => {
  describe("#run", () => {
    it("zoom-out the current tab", async () => {
      jest.spyOn(chrome.tabs, "getZoom").mockResolvedValue(1);
      const mockSetZoom = jest
        .spyOn(chrome.tabs, "setZoom")
        .mockResolvedValue();

      const sut = new ZoomInOperator();
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(mockSetZoom).toHaveBeenCalledWith(100, 1.1);
    });
  });
});
