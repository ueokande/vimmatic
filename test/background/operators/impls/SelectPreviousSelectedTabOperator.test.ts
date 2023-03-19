import SelectPreviousSelectedTabOperator from "../../../../src/background/operators/impls/SelectPreviousSelectedTabOperator";
import MockLastSelectedTabRepository from "../../mock/MockLastSelectedTabRepository";

describe("SelectPreviousSelectedTabOperator", () => {
  const lastSelectedTabRepository = new MockLastSelectedTabRepository();
  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockResolvedValue({} as chrome.tabs.Tab);

  beforeEach(() => {
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("select the last-selected tab", async () => {
      jest
        .spyOn(lastSelectedTabRepository, "getLastSelectedTabId")
        .mockResolvedValue(101);

      const sut = new SelectPreviousSelectedTabOperator(
        lastSelectedTabRepository
      );
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(101, { active: true });
    });

    it("do nothing if no last-selected tabs", async () => {
      jest
        .spyOn(lastSelectedTabRepository, "getLastSelectedTabId")
        .mockResolvedValue(undefined);

      const sut = new SelectPreviousSelectedTabOperator(
        lastSelectedTabRepository
      );
      await sut.run();

      expect(mockTabsUpdate).not.toBeCalled();
    });
  });
});
