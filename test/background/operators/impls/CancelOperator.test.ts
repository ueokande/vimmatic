import CancelOperator from "../../../../src/background/operators/impls/CancelOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, expect, it, vi } from "vitest";

describe("CancelOperator", () => {
  describe("#run", () => {
    it("hides console", async () => {
      const consoleClient = new MockConsoleClient();
      const spy = vi
        .spyOn(consoleClient, "hide")
        .mockResolvedValueOnce(undefined);

      const sut = new CancelOperator(consoleClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(spy).toHaveBeenCalledWith(100);
    });
  });
});
