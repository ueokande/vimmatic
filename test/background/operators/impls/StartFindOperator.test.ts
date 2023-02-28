import StartFindOperator from "../../../../src/background/operators/impls/StartFindOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("StartFindOperator", () => {
  jest
    .spyOn(browser.tabs, "query")
    .mockResolvedValue([
      { id: 100, url: "https://example.com/" } as browser.tabs.Tab,
    ]);
  const consoleClient = new MockConsoleClient();
  const showFindSpy = jest
    .spyOn(consoleClient, "showFind")
    .mockReturnValue(Promise.resolve());

  describe("#run", () => {
    it("show find console", async () => {
      const sut = new StartFindOperator(consoleClient);
      const ctx = { sender: { tabId: 100 } } as RequestContext;
      await sut.run(ctx);

      expect(showFindSpy).toBeCalledWith(100);
    });
  });
});
