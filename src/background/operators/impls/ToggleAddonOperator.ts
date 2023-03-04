import { inject, injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import AddonEnabledUseCase from "../../usecases/AddonEnabledUseCase";

@injectable()
export default class ToggleAddonOperator implements Operator {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  name(): string {
    return "addon.toggle.enabled";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    await this.addonEnabledUseCase.toggle(ctx.sender.tabId);
  }
}
