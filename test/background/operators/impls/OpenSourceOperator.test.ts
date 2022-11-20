import OpenSourceOperator from "../../../../src/background/operators/impls/OpenSourceOperator";

describe("OpenSourceOperator", () => {
  describe("#run", () => {
    const mockTabsCreate = jest
      .spyOn(browser.tabs, "create")
      .mockResolvedValue({} as browser.tabs.Tab);
    jest
      .spyOn(browser.tabs, "query")
      .mockResolvedValue([{ url: "https://example.com/" } as browser.tabs.Tab]);

    it("opens view-source URL of the current tab", async () => {
      const sut = new OpenSourceOperator();
      await sut.run();

      expect(mockTabsCreate).toBeCalledWith({
        url: "view-source:https://example.com/",
      });
    });
  });
});
