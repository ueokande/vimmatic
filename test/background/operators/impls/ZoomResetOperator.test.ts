import ZoomResetOperator from "../../../../src/background/operators/impls/ZoomResetOperator";

describe("ResetZoomOperator", () => {
  describe("#run", () => {
    it("resets zoom on the tab", async () => {
      const mockSetZoom = jest
        .spyOn(chrome.tabs, "setZoom")
        .mockResolvedValue();

      const sut = new ZoomResetOperator();
      await sut.run();

      expect(mockSetZoom).toBeCalledWith(0);
    });
  });
});
