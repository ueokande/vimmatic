import NavigateLinkPrevOperator from "../../../../src/background/operators/impls/NavigateLinkPrevOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";
import type { OperatorContext } from "../../../../src/background/operators/types";

describe("NavigateLinkPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkPrevSpy = jest
        .spyOn(navigateClient, "linkPrev")
        .mockResolvedValue();

      const sut = new NavigateLinkPrevOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(linkPrevSpy).toHaveBeenCalledWith(100);
    });
  });
});
