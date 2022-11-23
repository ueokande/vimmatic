import ZoomInOperator from "../../../../src/background/operators/impls/ZoomInOperator";

describe("ZoomInOperator", () => {
  describe("#run", () => {
    it("zoom-out the current tab", async () => {
      jest
        .spyOn(browser.tabs, "query")
        .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);
      jest.spyOn(browser.tabs, "getZoom").mockResolvedValue(1);
      const mockSetZoom = jest
        .spyOn(browser.tabs, "setZoom")
        .mockResolvedValue();

      const sut = new ZoomInOperator();
      await sut.run();

      expect(mockSetZoom).toBeCalledWith(100, 1.1);
    });
  });
});
