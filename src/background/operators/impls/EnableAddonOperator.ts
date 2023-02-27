import { inject, injectable } from "inversify";
import Operator from "../Operator";
import AddonEnabledUseCase from "../../usecases/AddonEnabledUseCase";
import RequestContext from "../../infrastructures/RequestContext";

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

  async run(ctx: RequestContext): Promise<void> {
    await this.addonEnabledUseCase.toggle(ctx);
  }
}
