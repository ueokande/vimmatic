import ShowBufferCommandOperator from "../../../../src/background/operators/impls/ShowBufferCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("ShowBufferCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());

  describe("#run", () => {
    it("show command with buffer command", async () => {
      const sut = new ShowBufferCommandOperator(consoleClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(showCommandSpy).toBeCalledWith(100, "buffer ");
    });
  });
});
