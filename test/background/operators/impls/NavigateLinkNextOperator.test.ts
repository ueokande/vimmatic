import NavigateLinkNextOperator from "../../../../src/background/operators/impls/NavigateLinkNextOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateLinkNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkNextSpy = jest
        .spyOn(navigateClient, "linkNext")
        .mockReturnValueOnce(Promise.resolve());

      const ctx = { sender: { tab: { id: 100 } as browser.tabs.Tab } };
      const sut = new NavigateLinkNextOperator(navigateClient);
      await sut.run(ctx);

      expect(linkNextSpy).toBeCalledWith(100);
    });
  });
});
