import StartFindOperator from "../../../../src/background/operators/impls/StartFindOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

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
      await sut.run();

      expect(showFindSpy).toBeCalledWith(100);
    });
  });
});
