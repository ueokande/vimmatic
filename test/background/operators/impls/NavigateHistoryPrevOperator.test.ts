import NavigateHistoryPrevOperator from "../../../../src/background/operators/impls/NavigateHistoryPrevOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateHistoryPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate previous in the history", async () => {
      const navigateClient = new MockNavigateClient();
      const historyNextSpy = jest
        .spyOn(navigateClient, "historyPrev")
        .mockReturnValue(Promise.resolve());
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const sut = new NavigateHistoryPrevOperator(tabPresenter, navigateClient);

      await sut.run();

      expect(historyNextSpy).toBeCalledWith(1);
    });
  });
});
