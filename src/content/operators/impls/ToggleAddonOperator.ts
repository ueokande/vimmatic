import { injectable, inject } from "inversify";
import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import ConsoleFramePresenter from "../../presenters/ConsoleFramePresenter";

@injectable()
export default class ToggleAddonOperator implements Operator {
  constructor(
    @inject("AddonIndicatorClient")
    private readonly indicator: AddonIndicatorClient,
    @inject("AddonEnabledRepository")
    private readonly repository: AddonEnabledRepository,
    @inject("ConsoleFramePresenter")
    private readonly consoleFramePresenter: ConsoleFramePresenter
  ) {}

  name() {
    return "addon.toggle.enabled";
  }

  schema() {}

  async run(): Promise<void> {
    const enabled = !this.repository.get();
    this.repository.set(enabled);
    if (enabled) {
      this.consoleFramePresenter.attach();
    } else {
      this.consoleFramePresenter.detach();
    }
    await this.indicator.setEnabled(enabled);
  }
}
