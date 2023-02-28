import ReloadTabOperator from "../../../../src/background/operators/impls/ReloadTabOperator";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("ReloadTabOperator", () => {
  const reloadSpy = jest.spyOn(browser.tabs, "reload").mockResolvedValue();
  const ctx = {} as RequestContext;

  beforeEach(() => {
    reloadSpy.mockReset();
  });

  describe("#run", () => {
    it("reloads the current tab with cache", async () => {
      const sut = new ReloadTabOperator();
      await sut.run(ctx, { cache: true });

      expect(reloadSpy).toBeCalledWith({ bypassCache: true });
    });

    it("reloads the current tab without cache", async () => {
      const sut = new ReloadTabOperator();
      await sut.run(ctx, { cache: false });

      expect(reloadSpy).toBeCalledWith({ bypassCache: false });
    });
  });
});
