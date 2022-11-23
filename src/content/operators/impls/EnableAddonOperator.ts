import { injectable, inject } from "inversify";
import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import ConsoleFramePresenter from "../../presenters/ConsoleFramePresenter";

@injectable()
export default class EnableAddonOperator implements Operator {
  constructor(
    @inject("AddonIndicatorClient")
    private readonly indicator: AddonIndicatorClient,
    @inject("AddonEnabledRepository")
    private readonly repository: AddonEnabledRepository,
    @inject("ConsoleFramePresenter")
    private readonly consoleFramePresenter: ConsoleFramePresenter
  ) {}

  name() {
    return "addon.enable";
  }

  schema() {}

  async run(): Promise<void> {
    this.repository.set(true);
    this.consoleFramePresenter.attach();
    await this.indicator.setEnabled(true);
  }
}
