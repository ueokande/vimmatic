import { injectable, inject } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

@injectable()
export default class HorizontalScrollOperator implements Operator {
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
    return "scroll.horizonally";
  }

  schema() {
    return z.object({
      count: z.number().default(1),
    });
  }

  async run({
    count,
  }: z.infer<ReturnType<HorizontalScrollOperator["schema"]>>): Promise<void> {
    this.presenter.scrollHorizonally(count, this.smoothscroll);
  }
}
