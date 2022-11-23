import { injectable, inject } from "inversify";
import AbstractScrollOperator from "./AbstractScrollOperator";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

@injectable()
export default class ScrollToHomeOperator
  extends AbstractScrollOperator
  implements Operator
{
  constructor(
    @inject("ScrollPresenter")
    private readonly presenter: ScrollPresenter,
    @inject("SettingRepository")
    settingRepository: SettingRepository
  ) {
    super(settingRepository);
  }

  name() {
    return "scroll.home";
  }

  schema() {}

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToHome(smooth);
  }
}
