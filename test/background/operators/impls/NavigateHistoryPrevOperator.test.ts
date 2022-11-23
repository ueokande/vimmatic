import NavigateHistoryPrevOperator from "../../../../src/background/operators/impls/NavigateHistoryPrevOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateHistoryPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate previous in the history", async () => {
      const navigateClient = new MockNavigateClient();
      const historyNextSpy = jest
        .spyOn(navigateClient, "historyPrev")
        .mockReturnValue(Promise.resolve());

      const ctx = { sender: { tab: { id: 100 } as browser.tabs.Tab } };
      const sut = new NavigateHistoryPrevOperator(navigateClient);
      await sut.run(ctx);

      expect(historyNextSpy).toBeCalledWith(100);
    });
  });
});
