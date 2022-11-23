import { injectable, inject } from "inversify";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

@injectable()
export default class ScrollToTopOperator implements Operator {
  private readonly smoothscroll: boolean;

  constructor(
    @inject("ScrollPresenter")
    private readonly presenter: ScrollPresenter,
    @inject("SettingRepository")
    settingRepository: SettingRepository
  ) {
    const { smoothscroll } = settingRepository.getProperties();
    this.smoothscroll = smoothscroll as boolean;
  }

  name() {
    return "scroll.top";
  }

  schema() {}

  async run(): Promise<void> {
    this.presenter.scrollToTop(this.smoothscroll);
  }
}
