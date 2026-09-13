import { describe, expect, it, vi } from "vitest";
import { NavigateHistoryNextOperator } from "../../../../src/background/operators/impls/NavigateHistoryNextOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { MockNavigateClient } from "../../mock/MockNavigateClient";

describe("NavigateHistoryNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next in the history", async () => {
      const navigateClient = new MockNavigateClient();
      const historyNextSpy = vi
        .spyOn(navigateClient, "historyNext")
        .mockResolvedValue();

      const sut = new NavigateHistoryNextOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(historyNextSpy).toHaveBeenCalledWith(100);
    });
  });
});
