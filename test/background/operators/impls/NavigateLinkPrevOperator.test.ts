import NavigateLinkPrevOperator from "../../../../src/background/operators/impls/NavigateLinkPrevOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateLinkPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      jest
        .spyOn(browser.tabs, "query")
        .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);

      const navigateClient = new MockNavigateClient();
      const linkPrevSpy = jest
        .spyOn(navigateClient, "linkPrev")
        .mockReturnValueOnce(Promise.resolve());

      const sut = new NavigateLinkPrevOperator(navigateClient);
      await sut.run();

      expect(linkPrevSpy).toBeCalledWith(100);
    });
  });
});
