import ShowAddBookmarkOperator from "../../../../src/background/operators/impls/ShowAddBookmarkOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("ShowAddBookmarkOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());
  const ctx = {
    sender: {
      tabId: 100,
      frameId: 0,
      tab: { id: 100, title: "welcome, world" } as browser.tabs.Tab,
    },
  } as RequestContext;

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with addbookmark command", async () => {
      const sut = new ShowAddBookmarkOperator(consoleClient);
      await sut.run(ctx, { alter: false });

      expect(showCommandSpy).toBeCalledWith(100, "addbookmark ");
    });

    it("show command with addbookmark command and an URL of the current tab", async () => {
      const sut = new ShowAddBookmarkOperator(consoleClient);
      await sut.run(ctx, { alter: true });

      expect(showCommandSpy).toBeCalledWith(100, "addbookmark welcome, world");
    });
  });
});
