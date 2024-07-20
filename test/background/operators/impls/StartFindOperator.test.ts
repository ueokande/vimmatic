import { StartFindOperator } from "../../../../src/background/operators/impls/StartFindOperator";
import { MockConsoleClient } from "../../mock/MockConsoleClient";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, it, expect, vi } from "vitest";

describe("StartFindOperator", () => {
  vi.spyOn(chrome.tabs, "query").mockResolvedValue([
    { id: 100, url: "https://example.com/" } as chrome.tabs.Tab,
  ]);
  const consoleClient = new MockConsoleClient();
  const showFindSpy = vi.spyOn(consoleClient, "showFind").mockResolvedValue();

  describe("#run", () => {
    it("show find console", async () => {
      const sut = new StartFindOperator(consoleClient);
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(showFindSpy).toHaveBeenCalledWith(100);
    });
  });
});
