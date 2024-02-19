import CloseTabOperator from "../../../../src/background/operators/impls/CloseTabOperator";
import defaultTab from "../../mock/defaultTab";

describe("CloseTabOperator", () => {
  const mockTabsRemove = jest.spyOn(chrome.tabs, "remove");
  const mockTabsUpdate = jest.spyOn(chrome.tabs, "update");

  mockTabsRemove.mockResolvedValue();
  mockTabsUpdate.mockResolvedValue({} as any);

  beforeEach(() => {
    mockTabsRemove.mockClear();
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("close a current tab", async () => {
      const ctx = {
        sender: {
          tabId: 100,
          frameId: 0,
          tab: { ...defaultTab, id: 100, index: 0, pinned: false },
        },
      };
      const sut = new CloseTabOperator();
      await sut.run(ctx, {});

      expect(mockTabsRemove).toHaveBeenCalledWith(100);
    });

    it("close a current tab forcely", async () => {
      const ctx = {
        sender: {
          tabId: 100,
          frameId: 0,
          tab: { ...defaultTab, id: 100, index: 0, pinned: true },
        },
      };
      const sut = new CloseTabOperator();
      await sut.run(ctx, { force: true });

      expect(mockTabsRemove).toHaveBeenCalledWith(100);
    });

    it("close a current tab and select left of the closed tab", async () => {
      const tabs = [
        { ...defaultTab, id: 101, index: 0, pinned: false, active: false },
        { ...defaultTab, id: 102, index: 1, pinned: false, active: true },
        { ...defaultTab, id: 103, index: 2, pinned: false, active: false },
      ];
      jest.spyOn(chrome.tabs, "query").mockResolvedValue(tabs);

      const ctx = {
        sender: {
          tabId: 102,
          frameId: 0,
          tab: tabs[1],
        },
      };
      const sut = new CloseTabOperator();
      await sut.run(ctx, { force: true, select: "left" });

      expect(mockTabsRemove).toHaveBeenCalledWith(102);
      expect(mockTabsUpdate).toHaveBeenCalledWith(101, { active: true });
    });
  });
});
