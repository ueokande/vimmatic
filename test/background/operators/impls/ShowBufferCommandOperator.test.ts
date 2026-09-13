import { describe, expect, it, vi } from "vitest";
import { ShowBufferCommandOperator } from "../../../../src/background/operators/impls/ShowBufferCommandOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { MockConsoleClient } from "../../mock/MockConsoleClient";

describe("ShowBufferCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = vi
    .spyOn(consoleClient, "showCommand")
    .mockResolvedValue();

  describe("#run", () => {
    it("show command with buffer command", async () => {
      const sut = new ShowBufferCommandOperator(consoleClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(showCommandSpy).toHaveBeenCalledWith(100, "buffer ");
    });
  });
});
