import { NavigateParentOperator } from "../../../../src/background/operators/impls/NavigateParentOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";
import { describe, beforeEach, it, expect, vi } from "vitest";

describe("NavigateParentOperator", () => {
  const mockTabsUpdate = vi
    .spyOn(chrome.tabs, "update")
    .mockImplementation(() => Promise.resolve({}));

  beforeEach(() => {
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("opens a parent directory of the file in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/banana",
          },
        },
      } as OperatorContext;
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toHaveBeenCalledWith({
        url: "https://example.com/fruits/yellow/",
      });
    });

    it("opens a parent directory of the directory in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/",
          },
        },
      } as OperatorContext;
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toHaveBeenCalledWith({
        url: "https://example.com/fruits/",
      });
    });

    it("removes a hash in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/#top",
          },
        },
      } as OperatorContext;
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toHaveBeenCalledWith({
        url: "https://example.com/fruits/yellow/",
      });
    });

    it("removes query parameters in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/search?q=apple",
          },
        },
      } as OperatorContext;
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toHaveBeenCalledWith({
        url: "https://example.com/search",
      });
    });
  });
});
