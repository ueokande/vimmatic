import { injectable, inject } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

@injectable()
export default class PageScrollOperator implements Operator {
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
    return "scroll.pages";
  }

  schema() {
    return z.object({
      count: z.number().default(1),
    });
  }

  async run({
    count,
  }: z.infer<ReturnType<PageScrollOperator["schema"]>>): Promise<void> {
    this.presenter.scrollPages(count, this.smoothscroll);
  }
}
