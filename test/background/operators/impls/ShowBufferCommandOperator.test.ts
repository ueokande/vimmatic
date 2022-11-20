import ShowBufferCommandOperator from "../../../../src/background/operators/impls/ShowBufferCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowBufferCommandOperator", () => {
  jest
    .spyOn(browser.tabs, "query")
    .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());

  describe("#run", () => {
    it("show command with buffer command", async () => {
      const sut = new ShowBufferCommandOperator(consoleClient);
      await sut.run();

      expect(showCommandSpy).toBeCalledWith(100, "buffer ");
    });
  });
});
