import OpenSourceOperator from "../../../../src/background/operators/impls/OpenSourceOperator";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("OpenSourceOperator", () => {
  describe("#run", () => {
    const mockTabsCreate = jest
      .spyOn(browser.tabs, "create")
      .mockResolvedValue({} as browser.tabs.Tab);

    it("opens view-source URL of the current tab", async () => {
      const ctx = {
        sender: {
          tab: { id: 100, url: "https://example.com/" } as browser.tabs.Tab,
        },
      } as RequestContext;
      const sut = new OpenSourceOperator();
      await sut.run(ctx);

      expect(mockTabsCreate).toBeCalledWith({
        url: "view-source:https://example.com/",
      });
    });
  });
});
