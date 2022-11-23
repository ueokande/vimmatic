import ZoomOutOperator from "../../../../src/background/operators/impls/ZoomOutOperator";

describe("ZoomOutOperator", () => {
  describe("#run", () => {
    it("zoom-in the current tab", async () => {
      jest
        .spyOn(browser.tabs, "query")
        .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);
      jest.spyOn(browser.tabs, "getZoom").mockResolvedValue(1);
      const mockSetZoom = jest
        .spyOn(browser.tabs, "setZoom")
        .mockResolvedValue();

      const sut = new ZoomOutOperator();
      await sut.run();

      expect(mockSetZoom).toBeCalledWith(100, 0.9);
    });
  });
});
