import NavigateRootOperator from "../../../../src/background/operators/impls/NavigateRootOperator";

describe("NavigateRootOperator", () => {
  describe("#run", () => {
    it("opens root directory in the URL", async () => {
      const mockTabsUpdate = jest
        .spyOn(browser.tabs, "update")
        .mockResolvedValue({} as browser.tabs.Tab);
      jest.spyOn(browser.tabs, "query").mockResolvedValue([
        {
          id: 100,
          url: "https://example.com/search?q=apple#top",
        } as browser.tabs.Tab,
      ]);

      const sut = new NavigateRootOperator();

      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(100, {
        url: "https://example.com",
      });
    });
  });
});
