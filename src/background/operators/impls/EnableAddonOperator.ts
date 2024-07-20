import { inject, injectable } from "inversify";
import type { Operator } from "../types";
import { AddonEnabledUseCase } from "../../usecases/AddonEnabledUseCase";

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

  async run(): Promise<void> {
    await this.addonEnabledUseCase.enable();
  }
}
