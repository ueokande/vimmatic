import { inject, injectable } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import AddonEnabledUseCase from "../../usecases/AddonEnabledUseCase";

@injectable()
export default class DisableAddonOperator implements Operator {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  name(): string {
    return "addon.enable";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    await this.addonEnabledUseCase.toggle(ctx.sender.tabId);
  }
}
