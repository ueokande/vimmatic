import { SelectPreviousSelectedTabOperator } from "../../../../src/background/operators/impls/SelectPreviousSelectedTabOperator";
import { MockLastSelectedTabRepository } from "../../mock/MockLastSelectedTabRepository";
import { describe, it, expect, vi } from "vitest";

describe("SelectPreviousSelectedTabOperator", () => {
  const lastSelectedTabRepository = new MockLastSelectedTabRepository();
  const mockTabsUpdate = vi
    .spyOn(chrome.tabs, "update")
    .mockImplementation(() => Promise.resolve({}));

  describe("#run", () => {
    it("select the last-selected tab", async () => {
      vi.spyOn(
        lastSelectedTabRepository,
        "getLastSelectedTabId",
      ).mockResolvedValue(101);

      const sut = new SelectPreviousSelectedTabOperator(
        lastSelectedTabRepository,
      );
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith(101, { active: true });
    });

    it("do nothing if no last-selected tabs", async () => {
      vi.spyOn(
        lastSelectedTabRepository,
        "getLastSelectedTabId",
      ).mockResolvedValue(undefined);

      const sut = new SelectPreviousSelectedTabOperator(
        lastSelectedTabRepository,
      );
      await sut.run();

      expect(mockTabsUpdate).not.toHaveBeenCalled();
    });
  });
});
