import NavigateLinkNextOperator from "../../../../src/background/operators/impls/NavigateLinkNextOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateLinkNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      jest
        .spyOn(browser.tabs, "query")
        .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);

      const navigateClient = new MockNavigateClient();
      const linkNextSpy = jest
        .spyOn(navigateClient, "linkNext")
        .mockReturnValueOnce(Promise.resolve());

      const sut = new NavigateLinkNextOperator(navigateClient);
      await sut.run();

      expect(linkNextSpy).toBeCalledWith(100);
    });
  });
});
