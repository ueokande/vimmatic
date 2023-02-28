import CancelOperator from "../../../../src/background/operators/impls/CancelOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("CancelOperator", () => {
  describe("#run", () => {
    it("hides console", async () => {
      const consoleClient = new MockConsoleClient();
      const spy = jest
        .spyOn(consoleClient, "hide")
        .mockResolvedValueOnce(undefined);

      const sut = new CancelOperator(consoleClient);
      const ctx = { sender: { tabId: 100 } } as RequestContext;
      await sut.run(ctx);

      expect(spy).toBeCalledWith(100);
    });
  });
});
