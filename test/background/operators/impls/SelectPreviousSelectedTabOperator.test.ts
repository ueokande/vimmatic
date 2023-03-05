import SelectPreviousSelectedTabOperator from "../../../../src/background/operators/impls/SelectPreviousSelectedTabOperator";
import LastSelectedTab from "../../../../src/background/tabs/LastSelectedTab";

class MockLastSelectedTab implements LastSelectedTab {
  get(): number | undefined {
    throw new Error("not implemented");
  }
}

describe("SelectPreviousSelectedTabOperator", () => {
  const lastSelectedtab = new MockLastSelectedTab();
  const mockTabsUpdate = jest
    .spyOn(chrome.tabs, "update")
    .mockResolvedValue({} as chrome.tabs.Tab);

  beforeEach(() => {
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("select the last-selected tab", async () => {
      jest.spyOn(lastSelectedtab, "get").mockReturnValue(101);

      const sut = new SelectPreviousSelectedTabOperator(lastSelectedtab);
      await sut.run();

      expect(mockTabsUpdate).toBeCalledWith(101, { active: true });
    });

    it("do nothing if no last-selected tabs", async () => {
      jest.spyOn(lastSelectedtab, "get").mockReturnValue(undefined);

      const sut = new SelectPreviousSelectedTabOperator(lastSelectedtab);
      await sut.run();

      expect(mockTabsUpdate).not.toBeCalled();
    });
  });
});
