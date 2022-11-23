import HorizontalScrollOperator from "../../../../src/content/operators/impls/HorizontalScrollOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("HorizontalScrollOperator", () => {
  describe("#run", () => {
    it("scroll horizontally", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new HorizontalScrollOperator(presenter, settingRepository);

      await sut.run({ count: 5 });

      expect(presenter.getScroll()).toEqual({ x: 5, y: 0 });
    });
  });
});
