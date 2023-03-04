import DuplicateTabOperator from "../../../../src/background/operators/impls/DuplicateTabOperator";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("DuplicateTabOperator", () => {
  describe("#run", () => {
    it("duplicate a tab", async () => {
      const mockTabsDuplicate = jest
        .spyOn(browser.tabs, "duplicate")
        .mockResolvedValue({} as browser.tabs.Tab);

      const sut = new DuplicateTabOperator();
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(mockTabsDuplicate).toBeCalledWith(100);
    });
  });
});
