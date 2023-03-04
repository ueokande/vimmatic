import NavigateHistoryPrevOperator from "../../../../src/background/operators/impls/NavigateHistoryPrevOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("NavigateHistoryPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate previous in the history", async () => {
      const navigateClient = new MockNavigateClient();
      const historyNextSpy = jest
        .spyOn(navigateClient, "historyPrev")
        .mockReturnValue(Promise.resolve());

      const sut = new NavigateHistoryPrevOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(historyNextSpy).toBeCalledWith(100);
    });
  });
});
