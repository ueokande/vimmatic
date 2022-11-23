import ShowCommandOperator from "../../../../src/background/operators/impls/ShowCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with addbookmark command", async () => {
      const ctx = { sender: { tab: { id: 100 } as browser.tabs.Tab } };
      const sut = new ShowCommandOperator(consoleClient);
      await sut.run(ctx);

      expect(showCommandSpy).toBeCalledWith(100, "");
    });
  });
});
