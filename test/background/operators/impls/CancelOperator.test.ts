import CancelOperator from "../../../../src/background/operators/impls/CancelOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("CancelOperator", () => {
  describe("#run", () => {
    it("hides console", async () => {
      const consoleClient = new MockConsoleClient();
      const spy = jest
        .spyOn(consoleClient, "hide")
        .mockResolvedValueOnce(undefined);

      const sut = new CancelOperator(consoleClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(spy).toHaveBeenCalledWith(100);
    });
  });
});
