import DuplicateTabOperator from "../../../../src/background/operators/impls/DuplicateTabOperator";
import type { OperatorContext } from "../../../../src/background/operators/types";

describe("DuplicateTabOperator", () => {
  describe("#run", () => {
    it("duplicate a tab", async () => {
      const mockTabsDuplicate = jest
        .spyOn(chrome.tabs, "duplicate")
        .mockImplementation(() => Promise.resolve({}));

      const sut = new DuplicateTabOperator();
      const ctx = { sender: { tabId: 100 } } as OperatorContext;
      await sut.run(ctx);

      expect(mockTabsDuplicate).toHaveBeenCalledWith(100);
    });
  });
});
