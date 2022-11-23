import { injectable, inject } from "inversify";
import type OperatorRegistory from "./OperatorRegistory";
import { OperatorRegistryImpl } from "./OperatorRegistory";
import DisableAddonOperator from "./impls/DisableAddonOperator";
import EnableAddonOperator from "./impls/EnableAddonOperator";
import EnableJumpMarkOperator from "./impls/EnableJumpMarkOperator";
import EnableSetMarkOperator from "./impls/EnableSetMarkOperator";
import FocusOperator from "./impls/FocusOperator";
import HorizontalScrollOperator from "./impls/HorizontalScrollOperator";
import PageScrollOperator from "./impls/PageScrollOperator";
import PasteOperator from "./impls/PasteOperator";
import ScrollToBottomOperator from "./impls/ScrollToBottomOperator";
import ScrollToEndOperator from "./impls/ScrollToEndOperator";
import ScrollToHomeOperator from "./impls/ScrollToHomeOperator";
import ScrollToTopOperator from "./impls/ScrollToTopOperator";
import StartFollowOperator from "./impls/StartFollowOperator";
import ToggleAddonOperator from "./impls/ToggleAddonOperator";
import VerticalScrollOperator from "./impls/VerticalScrollOperator";
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
    @inject(HorizontalScrollOperator)
    private readonly horizontalScrollOperator: HorizontalScrollOperator,
    @inject(PageScrollOperator)
    private readonly pageScrollOperator: PageScrollOperator,
    @inject(PasteOperator)
    private readonly pasteOperator: PasteOperator,
    @inject(ScrollToBottomOperator)
    private readonly scrollToBottomOperator: ScrollToBottomOperator,
    @inject(ScrollToEndOperator)
    private readonly scrollToEndOperator: ScrollToEndOperator,
    @inject(ScrollToHomeOperator)
    private readonly scrollToHomeOperator: ScrollToHomeOperator,
    @inject(ScrollToTopOperator)
    private readonly scrollToTopOperator: ScrollToTopOperator,
    @inject(StartFollowOperator)
    private readonly startFollowOperator: StartFollowOperator,
    @inject(ToggleAddonOperator)
    private readonly toggleAddonOperator: ToggleAddonOperator,
    @inject(VerticalScrollOperator)
    private readonly verticalScrollOperator: VerticalScrollOperator,
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
    r.register(this.horizontalScrollOperator);
    r.register(this.pageScrollOperator);
    r.register(this.pasteOperator);
    r.register(this.scrollToBottomOperator);
    r.register(this.scrollToEndOperator);
    r.register(this.scrollToHomeOperator);
    r.register(this.scrollToTopOperator);
    r.register(this.startFollowOperator);
    r.register(this.toggleAddonOperator);
    r.register(this.verticalScrollOperator);
    r.register(this.yankURLOperator);
    return r;
  }
}
