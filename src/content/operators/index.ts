import { injectable, inject } from "inversify";
import type OperatorRegistory from "./OperatorRegistory";
import { OperatorRegistryImpl } from "./OperatorRegistory";
import DisableAddonOperator from "./impls/DisableAddonOperator";
import EnableAddonOperator from "./impls/EnableAddonOperator";
import ToggleAddonOperator from "./impls/ToggleAddonOperator";

@injectable()
export class OperatorRegistoryFactory {
  constructor(
    @inject(DisableAddonOperator)
    private readonly disableAddonOperator: DisableAddonOperator,
    @inject(EnableAddonOperator)
    private readonly enableAddonOperator: EnableAddonOperator,
    @inject(ToggleAddonOperator)
    private readonly toggleAddonOperator: ToggleAddonOperator
  ) {}

  create(): OperatorRegistory {
    const r = new OperatorRegistryImpl();
    r.register(this.disableAddonOperator);
    r.register(this.enableAddonOperator);
    r.register(this.toggleAddonOperator);
    return r;
  }
}
