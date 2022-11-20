import ShowCommandOperator from "../../../../src/background/operators/impls/ShowCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowCommandOperator", () => {
  jest
    .spyOn(browser.tabs, "query")
    .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with addbookmark command", async () => {
      const sut = new ShowCommandOperator(consoleClient);
      await sut.run();

      expect(showCommandSpy).toBeCalledWith(100, "");
    });
  });
});
