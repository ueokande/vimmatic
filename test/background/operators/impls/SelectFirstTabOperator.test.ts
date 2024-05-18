import SelectFirstTabOperator from "../../../../src/background/operators/impls/SelectFirstTabOperator";
import defaultTab from "../../mock/defaultTab";
import { describe, it, expect, vi } from "vitest";

describe("SelectFirstTabOperator", () => {
  vi.spyOn(chrome.tabs, "query").mockResolvedValue([
    { ...defaultTab, id: 101, index: 0, active: false },
    { ...defaultTab, id: 102, index: 1, active: true },
    { ...defaultTab, id: 103, index: 2, active: false },
  ]);

  const mockTabsUpdate = vi
    .spyOn(chrome.tabs, "update")
    .mockImplementation(() => Promise.resolve({}));

  describe("#run", () => {
    it("select the leftmost tab", async () => {
      const sut = new SelectFirstTabOperator();
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith(101, { active: true });
    });
  });
});
