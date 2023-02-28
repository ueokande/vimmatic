import NavigateRootOperator from "../../../../src/background/operators/impls/NavigateRootOperator";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("NavigateRootOperator", () => {
  describe("#run", () => {
    it("opens root directory in the URL", async () => {
      const mockTabsUpdate = jest
        .spyOn(browser.tabs, "update")
        .mockResolvedValue({} as browser.tabs.Tab);

      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/banana",
          },
        },
      } as RequestContext;
      const sut = new NavigateRootOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({ url: "https://example.com" });
    });
  });
});
