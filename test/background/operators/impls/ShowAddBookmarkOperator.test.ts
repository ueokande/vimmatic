import { ShowAddBookmarkOperator } from "../../../../src/background/operators/impls/ShowAddBookmarkOperator";
import { MockConsoleClient } from "../../mock/MockConsoleClient";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, beforeEach, it, expect, vi } from "vitest";

describe("ShowAddBookmarkOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = vi
    .spyOn(consoleClient, "showCommand")
    .mockResolvedValue();
  const ctx = {
    sender: {
      tabId: 100,
      frameId: 0,
      tab: { id: 100, title: "welcome, world" } as chrome.tabs.Tab,
    },
  } as OperatorContext;

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with addbookmark command", async () => {
      const sut = new ShowAddBookmarkOperator(consoleClient);
      await sut.run(ctx, { alter: false });

      expect(showCommandSpy).toHaveBeenCalledWith(100, "addbookmark ");
    });

    it("show command with addbookmark command and an URL of the current tab", async () => {
      const sut = new ShowAddBookmarkOperator(consoleClient);
      await sut.run(ctx, { alter: true });

      expect(showCommandSpy).toHaveBeenCalledWith(
        100,
        "addbookmark welcome, world",
      );
    });
  });
});
