import ShowTabOpenCommandOperator from "../../../../src/background/operators/impls/ShowTabOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowTabOpenCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());
  const ctx = {
    sender: {
      tab: { id: 100, url: "https://example.com/" } as browser.tabs.Tab,
    },
  };

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with tabopen command", async () => {
      const sut = new ShowTabOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: false });

      expect(showCommandSpy).toBeCalledWith(100, "tabopen ");
    });

    it("show command with tabopen command and an URL of the current tab", async () => {
      const sut = new ShowTabOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: true });

      expect(showCommandSpy).toBeCalledWith(
        100,
        "tabopen https://example.com/"
      );
    });
  });
});
