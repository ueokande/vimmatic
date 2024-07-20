import { inject, injectable } from "inversify";
import type { Operator } from "../types";
import { AddonEnabledUseCase } from "../../usecases/AddonEnabledUseCase";

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

  async run(): Promise<void> {
    await this.addonEnabledUseCase.disable();
  }
}
