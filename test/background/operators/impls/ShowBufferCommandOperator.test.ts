import ShowBufferCommandOperator from "../../../../src/background/operators/impls/ShowBufferCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowBufferCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());

  describe("#run", () => {
    it("show command with buffer command", async () => {
      const ctx = { sender: { tab: { id: 100 } as browser.tabs.Tab } };
      const sut = new ShowBufferCommandOperator(consoleClient);
      await sut.run(ctx);

      expect(showCommandSpy).toBeCalledWith(100, "buffer ");
    });
  });
});
