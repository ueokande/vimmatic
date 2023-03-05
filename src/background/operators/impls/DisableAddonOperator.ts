import { inject, injectable } from "inversify";
import Operator from "../Operator";
import AddonEnabledUseCase from "../../usecases/AddonEnabledUseCase";

@injectable()
export default class DisableAddonOperator implements Operator {
  constructor(
    @inject(AddonEnabledUseCase)
    private readonly addonEnabledUseCase: AddonEnabledUseCase
  ) {}

  name(): string {
    return "addon.disable";
  }

  schema() {}

  async run(): Promise<void> {
    await this.addonEnabledUseCase.disable();
  }
}
