import NavigateHistoryNextOperator from "../../../../src/background/operators/impls/NavigateHistoryNextOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateHistoryNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next in the history", async () => {
      const navigateClient = new MockNavigateClient();
      const historyNextSpy = jest
        .spyOn(navigateClient, "historyNext")
        .mockReturnValue(Promise.resolve());
      jest
        .spyOn(browser.tabs, "query")
        .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);

      const sut = new NavigateHistoryNextOperator(navigateClient);
      await sut.run();

      expect(historyNextSpy).toBeCalledWith(100);
    });
  });
});
