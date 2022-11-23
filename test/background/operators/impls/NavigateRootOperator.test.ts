import NavigateRootOperator from "../../../../src/background/operators/impls/NavigateRootOperator";

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
          } as browser.tabs.Tab,
        },
      };
      const sut = new NavigateRootOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({ url: "https://example.com" });
    });
  });
});
