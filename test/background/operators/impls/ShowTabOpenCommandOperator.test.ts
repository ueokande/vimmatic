import ShowTabOpenCommandOperator from "../../../../src/background/operators/impls/ShowTabOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowTabOpenCommandOperator", () => {
  jest
    .spyOn(browser.tabs, "query")
    .mockResolvedValue([
      { id: 100, url: "https://example.com/" } as browser.tabs.Tab,
    ]);
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with tabopen command", async () => {
      const sut = new ShowTabOpenCommandOperator(consoleClient, false);
      await sut.run();

      expect(showCommandSpy).toBeCalledWith(100, "tabopen ");
    });

    it("show command with tabopen command and an URL of the current tab", async () => {
      const sut = new ShowTabOpenCommandOperator(consoleClient, true);
      await sut.run();

      expect(showCommandSpy).toBeCalledWith(
        100,
        "tabopen https://example.com/"
      );
    });
  });
});
