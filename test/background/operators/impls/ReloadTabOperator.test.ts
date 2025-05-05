import { ReloadTabOperator } from "../../../../src/background/operators/impls/ReloadTabOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, it, expect, vi } from "vitest";

describe("ReloadTabOperator", () => {
  const reloadSpy = vi
    .spyOn(chrome.tabs, "reload")
    .mockImplementation(() => Promise.resolve());
  const ctx = {} as OperatorContext;

  describe("#run", () => {
    it("reloads the current tab with cache", async () => {
      const sut = new ReloadTabOperator();
      await sut.run(ctx, { cache: true });

      expect(reloadSpy).toHaveBeenCalledWith({ bypassCache: true });
    });

    it("reloads the current tab without cache", async () => {
      const sut = new ReloadTabOperator();
      await sut.run(ctx, { cache: false });

      expect(reloadSpy).toHaveBeenCalledWith({ bypassCache: false });
    });
  });
});
