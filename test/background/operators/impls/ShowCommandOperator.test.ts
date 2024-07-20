import { ShowCommandOperator } from "../../../../src/background/operators/impls/ShowCommandOperator";
import { MockConsoleClient } from "../../mock/MockConsoleClient";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, beforeEach, it, expect, vi } from "vitest";

describe("ShowCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = vi
    .spyOn(consoleClient, "showCommand")
    .mockResolvedValue();

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with addbookmark command", async () => {
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      const sut = new ShowCommandOperator(consoleClient);
      await sut.run(ctx);

      expect(showCommandSpy).toHaveBeenCalledWith(100, "");
    });
  });
});
