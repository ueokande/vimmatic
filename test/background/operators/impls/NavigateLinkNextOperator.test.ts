import { describe, expect, it, vi } from "vitest";
import { NavigateLinkNextOperator } from "../../../../src/background/operators/impls/NavigateLinkNextOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { MockNavigateClient } from "../../mock/MockNavigateClient";

describe("NavigateLinkNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkNextSpy = vi
        .spyOn(navigateClient, "linkNext")
        .mockResolvedValue();

      const sut = new NavigateLinkNextOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(linkNextSpy).toHaveBeenCalledWith(100);
    });
  });
});
