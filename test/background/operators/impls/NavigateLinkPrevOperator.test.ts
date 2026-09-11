import { describe, expect, it, vi } from "vitest";
import { NavigateLinkPrevOperator } from "../../../../src/background/operators/impls/NavigateLinkPrevOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { MockNavigateClient } from "../../mock/MockNavigateClient";

describe("NavigateLinkPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkPrevSpy = vi
        .spyOn(navigateClient, "linkPrev")
        .mockResolvedValue();

      const sut = new NavigateLinkPrevOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(linkPrevSpy).toHaveBeenCalledWith(100);
    });
  });
});
