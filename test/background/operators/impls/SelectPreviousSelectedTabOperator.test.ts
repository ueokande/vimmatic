import SelectPreviousSelectedTabOperator from "../../../../src/background/operators/impls/SelectPreviousSelectedTabOperator";
import MockLastSelectedTabRepository from "../../mock/MockLastSelectedTabRepository";

describe("SelectPreviousSelectedTabOperator", () => {
  const lastSelectedTabRepository = new MockLastSelectedTabRepository();
  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockImplementation(() => Promise.resolve({}));

  beforeEach(() => {
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("select the last-selected tab", async () => {
      jest
        .spyOn(lastSelectedTabRepository, "getLastSelectedTabId")
        .mockResolvedValue(101);

      const sut = new SelectPreviousSelectedTabOperator(
        lastSelectedTabRepository,
      );
      await sut.run();

      expect(mockTabsUpdate).toHaveBeenCalledWith(101, { active: true });
    });

    it("do nothing if no last-selected tabs", async () => {
      jest
        .spyOn(lastSelectedTabRepository, "getLastSelectedTabId")
        .mockResolvedValue(undefined);

      const sut = new SelectPreviousSelectedTabOperator(
        lastSelectedTabRepository,
      );
      await sut.run();

      expect(mockTabsUpdate).not.toHaveBeenCalled();
    });
  });
});
