import ZoomInOperator from "../../../../src/background/operators/impls/ZoomInOperator";

describe("ZoomInOperator", () => {
  describe("#run", () => {
    it("zoom-out the current tab", async () => {
      jest.spyOn(browser.tabs, "getZoom").mockResolvedValue(1);
      const mockSetZoom = jest
        .spyOn(browser.tabs, "setZoom")
        .mockResolvedValue();

      const ctx = { sender: { tab: { id: 100 } as browser.tabs.Tab } };
      const sut = new ZoomInOperator();
      await sut.run(ctx);

      expect(mockSetZoom).toBeCalledWith(100, 1.1);
    });
  });
});
