import { CloseTabOperator } from "../../../../src/background/operators/impls/CloseTabOperator";
import { defaultTab } from "../../mock/defaultTab";
import { describe, expect, beforeEach, it, vi } from "vitest";

describe("CloseTabOperator", () => {
  const mockTabsRemove = vi.spyOn(chrome.tabs, "remove");
  const mockTabsUpdate = vi.spyOn(chrome.tabs, "update");

  mockTabsRemove.mockImplementation(() => Promise.resolve());
  mockTabsUpdate.mockImplementation(() => Promise.resolve({}));

  beforeEach(() => {
    mockTabsRemove.mockClear();
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("close a current tab and select right of the closed tab", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, pinned: false, active: false },
        { ...defaultTab, id: 102, index: 1, pinned: false, active: true },
        { ...defaultTab, id: 103, index: 2, pinned: false, active: false },
      ];
      vi.spyOn(chrome.tabs, "query").mockResolvedValue(tabs);

      const ctx = {
        sender: {
          tabId: 102,
          frameId: 0,
          tab: tabs[1],
        },
      };
      const sut = new CloseTabOperator();
      await sut.run(ctx, { force: false, select: "right" });

      expect(mockTabsRemove).toHaveBeenCalledWith(102);
      expect(mockTabsUpdate).not.toHaveBeenCalled();
    });

    it("close a current tab and select left of the closed tab", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, pinned: false, active: false },
        { ...defaultTab, id: 102, index: 1, pinned: false, active: true },
        { ...defaultTab, id: 103, index: 2, pinned: false, active: false },
      ];
      vi.spyOn(chrome.tabs, "query").mockResolvedValue(tabs);

      const ctx = {
        sender: {
          tabId: 102,
          frameId: 0,
          tab: tabs[1],
        },
      };
      const sut = new CloseTabOperator();
      await sut.run(ctx, { force: false, select: "left" });

      expect(mockTabsRemove).toHaveBeenCalledWith(102);
      expect(mockTabsUpdate).toHaveBeenCalledWith(101, { active: true });
    });

    it("do nothing if the tab is pinned", async () => {
      const ctx = {
        sender: {
          tabId: 100,
          frameId: 0,
          tab: { ...defaultTab, id: 100, index: 0, pinned: true },
        },
      };
      const sut = new CloseTabOperator();
      await sut.run(ctx, { force: false, select: "right" });

      expect(mockTabsRemove).not.toHaveBeenCalled();
    });

    it("close a pinned tab", async () => {
      const ctx = {
        sender: {
          tabId: 100,
          frameId: 0,
          tab: { ...defaultTab, id: 100, index: 0, pinned: true },
        },
      };
      const sut = new CloseTabOperator();
      await sut.run(ctx, { force: true, select: "right" });

      expect(mockTabsRemove).toHaveBeenCalledWith(100);
    });
  });
});
