import NavigateHistoryNextOperator from "../../../../src/background/operators/impls/NavigateHistoryNextOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("NavigateHistoryNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next in the history", async () => {
      const navigateClient = new MockNavigateClient();
      const historyNextSpy = jest
        .spyOn(navigateClient, "historyNext")
        .mockReturnValue(Promise.resolve());

      const sut = new NavigateHistoryNextOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(historyNextSpy).toHaveBeenCalledWith(100);
    });
  });
});
