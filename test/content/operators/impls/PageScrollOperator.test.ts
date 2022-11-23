import PageScrollOperator from "../../../../src/content/operators/impls/PageScrollOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("PageScrollOperator", () => {
  describe("#run", () => {
    it("scroll by a page", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new PageScrollOperator(presenter, settingRepository);

      await sut.run({ count: 5 });

      expect(presenter.getScroll()).toEqual({ x: 5, y: 0 });
    });
  });
});
