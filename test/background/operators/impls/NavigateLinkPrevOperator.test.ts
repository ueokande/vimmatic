import NavigateLinkPrevOperator from "../../../../src/background/operators/impls/NavigateLinkPrevOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("NavigateLinkPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkPrevSpy = jest
        .spyOn(navigateClient, "linkPrev")
        .mockReturnValueOnce(Promise.resolve());

      const sut = new NavigateLinkPrevOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(linkPrevSpy).toBeCalledWith(100);
    });
  });
});
