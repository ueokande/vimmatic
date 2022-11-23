import { injectable, inject } from "inversify";
import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import ConsoleFramePresenter from "../../presenters/ConsoleFramePresenter";

@injectable()
export default class DisableAddonOperator implements Operator {
  constructor(
    @inject("AddonIndicatorClient")
    private readonly indicator: AddonIndicatorClient,
    @inject("AddonEnabledRepository")
    private readonly repository: AddonEnabledRepository,
    @inject("ConsoleFramePresenter")
    private readonly consoleFramePresenter: ConsoleFramePresenter
  ) {}

  name() {
    return "addon.disable";
  }

  schema() {}

  async run(): Promise<void> {
    this.repository.set(false);
    this.consoleFramePresenter.detach();
    await this.indicator.setEnabled(false);
  }
}
