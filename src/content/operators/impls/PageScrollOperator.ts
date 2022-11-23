import { injectable, inject } from "inversify";
import { z } from "zod";
import AbstractScrollOperator from "./AbstractScrollOperator";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

@injectable()
export default class PageScrollOperator
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
    const smooth = this.getSmoothScroll();
    this.presenter.scrollPages(count, smooth);
  }
}
