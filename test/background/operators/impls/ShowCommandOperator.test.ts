import ShowCommandOperator from "../../../../src/background/operators/impls/ShowCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

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
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      const sut = new ShowCommandOperator(consoleClient);
      await sut.run(ctx);

      expect(showCommandSpy).toBeCalledWith(100, "");
    });
  });
});
