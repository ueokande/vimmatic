import ShowAddBookmarkOperator from "../../../../src/background/operators/impls/ShowAddBookmarkOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowAddBookmarkOperator", () => {
  const props = {
    index: 0,
    highlighted: false,
    active: true,
    incognito: false,
    pinned: false,
  };
  jest
    .spyOn(browser.tabs, "query")
    .mockResolvedValue([{ ...props, title: "welcome, world", id: 100 }]);
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with addbookmark command", async () => {
      const sut = new ShowAddBookmarkOperator(consoleClient);
      await sut.run({ alter: false });

      expect(showCommandSpy).toBeCalledWith(100, "addbookmark ");
    });

    it("show command with addbookmark command and an URL of the current tab", async () => {
      const sut = new ShowAddBookmarkOperator(consoleClient);
      await sut.run({ alter: true });

      expect(showCommandSpy).toBeCalledWith(100, "addbookmark welcome, world");
    });
  });
});
