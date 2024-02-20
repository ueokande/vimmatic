import ReloadTabOperator from "../../../../src/background/operators/impls/ReloadTabOperator";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("ReloadTabOperator", () => {
  const reloadSpy = jest
    .spyOn(chrome.tabs, "reload")
    .mockImplementation(() => Promise.resolve());
  const ctx = {} as OperatorContext;

  beforeEach(() => {
    reloadSpy.mockReset();
  });

  describe("#run", () => {
    it("reloads the current tab with cache", async () => {
      const sut = new ReloadTabOperator();
      await sut.run(ctx, { cache: true });

      expect(reloadSpy).toHaveBeenCalledWith({ bypassCache: true });
    });

    it("reloads the current tab without cache", async () => {
      const sut = new ReloadTabOperator();
      await sut.run(ctx, { cache: false });

      expect(reloadSpy).toHaveBeenCalledWith({ bypassCache: false });
    });
  });
});
