import ZoomResetOperator from "../../../../src/background/operators/impls/ZoomResetOperator";

describe("ResetZoomOperator", () => {
  describe("#run", () => {
    it("resets zoom on the tab", async () => {
      const mockSetZoom = jest
        .spyOn(chrome.tabs, "setZoom")
        .mockImplementation(() => Promise.resolve());

      const sut = new ZoomResetOperator();
      await sut.run();

      expect(mockSetZoom).toHaveBeenCalledWith(0);
    });
  });
});
