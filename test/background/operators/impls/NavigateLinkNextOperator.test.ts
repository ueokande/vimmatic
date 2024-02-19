import NavigateLinkNextOperator from "../../../../src/background/operators/impls/NavigateLinkNextOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("NavigateLinkNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkNextSpy = jest
        .spyOn(navigateClient, "linkNext")
        .mockReturnValueOnce(Promise.resolve());

      const sut = new NavigateLinkNextOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(linkNextSpy).toHaveBeenCalledWith(100);
    });
  });
});
