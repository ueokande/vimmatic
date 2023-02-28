import ZoomOutOperator from "../../../../src/background/operators/impls/ZoomOutOperator";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("ZoomOutOperator", () => {
  describe("#run", () => {
    it("zoom-in the current tab", async () => {
      jest.spyOn(browser.tabs, "getZoom").mockResolvedValue(1);
      const mockSetZoom = jest
        .spyOn(browser.tabs, "setZoom")
        .mockResolvedValue();

      const sut = new ZoomOutOperator();
      const ctx = { sender: { tabId: 100 } } as RequestContext;
      await sut.run(ctx);

      expect(mockSetZoom).toBeCalledWith(100, 0.9);
    });
  });
});
