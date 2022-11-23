import { injectable, inject } from "inversify";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

@injectable()
export default class ScrollToHomeOperator implements Operator {
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
    return "scroll.home";
  }

  schema() {}

  async run(): Promise<void> {
    this.presenter.scrollToHome(this.smoothscroll);
  }
}
