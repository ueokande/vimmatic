import VerticalScrollOperator from "../../../../src/content/operators/impls/VerticalScrollOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("VerticalScrollOperator", () => {
  describe("#run", () => {
    it("scroll vertically", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new VerticalScrollOperator(presenter, settingRepository);

      await sut.run({ count: 5 });

      expect(presenter.getScroll()).toEqual({ x: 0, y: 5 });
    });
  });
});
