import { injectable, inject } from "inversify";
import type OperatorRegistory from "./OperatorRegistory";
import { OperatorRegistryImpl } from "./OperatorRegistory";
import DisableAddonOperator from "./impls/DisableAddonOperator";
import EnableAddonOperator from "./impls/EnableAddonOperator";
import EnableJumpMarkOperator from "./impls/EnableJumpMarkOperator";
import EnableSetMarkOperator from "./impls/EnableSetMarkOperator";
import StartFollowOperator from "./impls/StartFollowOperator";
import ToggleAddonOperator from "./impls/ToggleAddonOperator";

@injectable()
export class OperatorRegistoryFactory {
  constructor(
    @inject(DisableAddonOperator)
    private readonly disableAddonOperator: DisableAddonOperator,
    @inject(EnableAddonOperator)
    private readonly enableAddonOperator: EnableAddonOperator,
    @inject(ToggleAddonOperator)
    private readonly toggleAddonOperator: ToggleAddonOperator,
    @inject(EnableJumpMarkOperator)
    private readonly enableJumpMarkOperator: EnableJumpMarkOperator,
    @inject(EnableSetMarkOperator)
    private readonly enableSetMarkOperator: EnableSetMarkOperator,
    @inject(StartFollowOperator)
    private readonly startFollowOperator: StartFollowOperator
  ) {}

  create(): OperatorRegistory {
    const r = new OperatorRegistryImpl();
    r.register(this.disableAddonOperator);
    r.register(this.enableAddonOperator);
    r.register(this.toggleAddonOperator);
    r.register(this.enableJumpMarkOperator);
    r.register(this.enableSetMarkOperator);
    r.register(this.startFollowOperator);
    return r;
  }
}
