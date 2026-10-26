import { inject, injectable } from "inversify";
import { AddonEnabledUseCase } from "../../usecases/AddonEnabledUseCase";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class EnableAddonOperator implements Operator {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
  ) {}

  name(): string {
    return "addon.enable";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    await this.addonEnabledUseCase.enable(sender.tabId);
  }
}
