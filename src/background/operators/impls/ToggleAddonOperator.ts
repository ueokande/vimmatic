import { inject, injectable } from "inversify";
import type { Operator } from "../types";
import { AddonEnabledUseCase } from "../../usecases/AddonEnabledUseCase";

@injectable()
export class ToggleAddonOperator implements Operator {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase,
  ) {}

  name(): string {
    return "addon.toggle.enabled";
  }

  schema() {}

  async run(): Promise<void> {
    await this.addonEnabledUseCase.toggle();
  }
}
