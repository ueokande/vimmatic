import ZoomOutOperator from "../../../../src/background/operators/impls/ZoomOutOperator";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("ZoomOutOperator", () => {
  describe("#run", () => {
    it("zoom-in the current tab", async () => {
      jest.spyOn(browser.tabs, "getZoom").mockResolvedValue(1);
      const mockSetZoom = jest
        .spyOn(browser.tabs, "setZoom")
        .mockResolvedValue();

      const sut = new ZoomOutOperator();
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(mockSetZoom).toBeCalledWith(100, 0.9);
    });
  });
});
