import ShowWinOpenCommandOperator from "../../../../src/background/operators/impls/ShowWinOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowWinOpenCommandOperator", () => {
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
    it("show command with winopen command", async () => {
      const sut = new ShowWinOpenCommandOperator(consoleClient, false);
      await sut.run();

      expect(showCommandSpy).toBeCalledWith(100, "winopen ");
    });

    it("show command with winopen command and an URL of the current tab", async () => {
      const sut = new ShowWinOpenCommandOperator(consoleClient, true);
      await sut.run();

      expect(showCommandSpy).toBeCalledWith(
        100,
        "winopen https://example.com/"
      );
    });
  });
});
