import { inject, injectable } from "inversify";
import { AddonEnabledUseCase } from "../../usecases/AddonEnabledUseCase";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class DisableAddonOperator implements Operator {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
  ) {}

  name(): string {
    return "addon.disable";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.addonEnabledUseCase.disable(sender.tabId);
  }
}
