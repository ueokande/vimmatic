import ShowOpenCommandOperator from "../../../../src/background/operators/impls/ShowOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowOpenCommandOperator", () => {
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
    it("show command with open command", async () => {
      const sut = new ShowOpenCommandOperator(consoleClient);
      await sut.run({ alter: false });

      expect(showCommandSpy).toBeCalledWith(100, "open ");
    });

    it("show command with open command and an URL of the current tab", async () => {
      const sut = new ShowOpenCommandOperator(consoleClient);
      await sut.run({ alter: true });

      expect(showCommandSpy).toBeCalledWith(100, "open https://example.com/");
    });
  });
});
