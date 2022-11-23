import NavigateLinkPrevOperator from "../../../../src/background/operators/impls/NavigateLinkPrevOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateLinkPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkPrevSpy = jest
        .spyOn(navigateClient, "linkPrev")
        .mockReturnValueOnce(Promise.resolve());

      const ctx = { sender: { tab: { id: 100 } as browser.tabs.Tab } };
      const sut = new NavigateLinkPrevOperator(navigateClient);
      await sut.run(ctx);

      expect(linkPrevSpy).toBeCalledWith(100);
    });
  });
});
