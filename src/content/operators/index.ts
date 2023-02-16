import { injectable, inject } from "inversify";
import type OperatorRegistory from "./OperatorRegistory";
import { OperatorRegistryImpl } from "./OperatorRegistory";
import DisableAddonOperator from "./impls/DisableAddonOperator";
import EnableAddonOperator from "./impls/EnableAddonOperator";
import EnableJumpMarkOperator from "./impls/EnableJumpMarkOperator";
import EnableSetMarkOperator from "./impls/EnableSetMarkOperator";
import FocusOperator from "./impls/FocusOperator";
import PasteOperator from "./impls/PasteOperator";
import StartFollowOperator from "./impls/StartFollowOperator";
import ToggleAddonOperator from "./impls/ToggleAddonOperator";
import YankURLOperator from "./impls/YankURLOperator";

@injectable()
export class OperatorRegistoryFactory {
  constructor(
    @inject(DisableAddonOperator)
    private readonly disableAddonOperator: DisableAddonOperator,
    @inject(EnableAddonOperator)
    private readonly enableAddonOperator: EnableAddonOperator,
    @inject(EnableJumpMarkOperator)
    private readonly enableJumpMarkOperator: EnableJumpMarkOperator,
    @inject(EnableSetMarkOperator)
    private readonly enableSetMarkOperator: EnableSetMarkOperator,
    @inject(FocusOperator)
    private readonly focusOperator: FocusOperator,
    @inject(PasteOperator)
    private readonly pasteOperator: PasteOperator,
    @inject(StartFollowOperator)
    private readonly startFollowOperator: StartFollowOperator,
    @inject(ToggleAddonOperator)
    private readonly toggleAddonOperator: ToggleAddonOperator,
    @inject(YankURLOperator)
    private readonly yankURLOperator: YankURLOperator
  ) {}

  create(): OperatorRegistory {
    const r = new OperatorRegistryImpl();
    r.register(this.disableAddonOperator);
    r.register(this.enableAddonOperator);
    r.register(this.enableJumpMarkOperator);
    r.register(this.enableSetMarkOperator);
    r.register(this.focusOperator);
    r.register(this.pasteOperator);
    r.register(this.startFollowOperator);
    r.register(this.toggleAddonOperator);
    r.register(this.yankURLOperator);
    return r;
  }
}
