import ShowOpenCommandOperator from "../../../../src/background/operators/impls/ShowOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("ShowOpenCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());
  const ctx = {
    sender: {
      tabId: 100,
      tab: { id: 100, url: "https://example.com/" },
    },
  } as RequestContext;

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with open command", async () => {
      const sut = new ShowOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: false });

      expect(showCommandSpy).toBeCalledWith(100, "open ");
    });

    it("show command with open command and an URL of the current tab", async () => {
      const sut = new ShowOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: true });

      expect(showCommandSpy).toBeCalledWith(100, "open https://example.com/");
    });
  });
});
