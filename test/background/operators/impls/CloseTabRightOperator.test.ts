import { CloseTabRightOperator } from "../../../../src/background/operators/impls/CloseTabRightOperator";
import { defaultTab } from "../../mock/defaultTab";
import { describe, expect, it, vi } from "vitest";

describe("CloseTabRightOperator", () => {
  describe("#run", () => {
    const mockTabsRemove = vi
      .spyOn(chrome.tabs, "remove")
      .mockImplementation(() => Promise.resolve());

    it("close the right of the current tab", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, active: false },
        { ...defaultTab, id: 102, index: 1, active: true },
        { ...defaultTab, id: 103, index: 2, active: false },
        { ...defaultTab, id: 104, index: 3, active: false },
      ];
      vi.spyOn(chrome.tabs, "query").mockImplementation(({ active }) => {
        if (active) {
          return Promise.resolve([tabs[2]]);
        } else {
          return Promise.resolve(tabs);
        }
      });

      const sut = new CloseTabRightOperator();
      await sut.run();

      expect(mockTabsRemove).toHaveBeenCalledWith([103, 104]);
    });
  });
});
