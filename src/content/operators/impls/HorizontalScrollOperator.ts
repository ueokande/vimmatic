import { injectable, inject } from "inversify";
import { z } from "zod";
import AbstractScrollOperator from "./AbstractScrollOperator";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

@injectable()
export default class HorizontalScrollOperator
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
    const smooth = this.getSmoothScroll();
    this.presenter.scrollHorizonally(count, smooth);
  }
}
