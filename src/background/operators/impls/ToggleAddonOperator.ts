import { inject, injectable } from "inversify";
import { AddonEnabledUseCase } from "../../usecases/AddonEnabledUseCase";
import type { Operator } from "../types";

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
