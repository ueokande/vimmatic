import { injectable, inject } from "inversify";
import { QuickHintAction } from "./QuickHintAction";
import { OpenImageHintAction } from "./OpenImageHintAction";
import { YankURLHintAction } from "./YankURLHintAction";
import { YankLinkTextHintAction } from "./YankLinkTextHintAction";
import { OpenHintAction } from "./OpenHintAction";
import { TabopenHintAction } from "./TabopenHintAction";
import { WinopenHintAction } from "./WinopenHintAction";
import { OpenCommandHintAction } from "./OpenCommandHintAction";
import { TabopenCommandHintAction } from "./TabopenCommandHintAction";
import { WinopenCommandHintAction } from "./WinopenCommandHintAction";
import { OpenSourceHintAction } from "./OpenSourceHintAction";
import type { HintAction } from "./types";

export interface HintActionFactory {
  createHintAction(name: string): HintAction;
}

export const HintActionFactory = Symbol("HintActionFactory");

@injectable()
export class HintActionFactoryImpl implements HintActionFactory {
  constructor(
    @inject(QuickHintAction)
    private readonly quickHintAction: QuickHintAction,
    @inject(OpenImageHintAction)
    private readonly openImageHintAction: OpenImageHintAction,
    @inject(YankURLHintAction)
    private readonly yankURLHintAction: YankURLHintAction,
    @inject(YankLinkTextHintAction)
    private readonly yankLinkTextHintAction: YankLinkTextHintAction,
    @inject(OpenHintAction)
    private readonly openHintAction: OpenHintAction,
    @inject(TabopenHintAction)
    private readonly tabopenHintAction: TabopenHintAction,
    @inject(WinopenHintAction)
    private readonly winopenHintAction: WinopenHintAction,
    @inject(OpenCommandHintAction)
    private readonly openCommandHintAction: OpenCommandHintAction,
    @inject(TabopenCommandHintAction)
    private readonly tabopenCommandHintAction: TabopenCommandHintAction,
    @inject(WinopenCommandHintAction)
    private readonly winopenCommandHintAction: WinopenCommandHintAction,
    @inject(OpenSourceHintAction)
    private readonly openSourceHintAction: OpenSourceHintAction,
  ) {}
  createHintAction(name: string): HintAction {
    switch (name) {
      case "hint.quick":
        return this.quickHintAction;
      case "hint.openimage":
        return this.openImageHintAction;
      case "hint.yankurl":
        return this.yankURLHintAction;
      case "hint.yanklinktext":
        return this.yankLinkTextHintAction;
      case "hint.open":
        return this.openHintAction;
      case "hint.tabopen":
        return this.tabopenHintAction;
      case "hint.winopen":
        return this.winopenHintAction;
      case "hint.command.open":
        return this.openCommandHintAction;
      case "hint.command.tabopen":
        return this.tabopenCommandHintAction;
      case "hint.command.winopen":
        return this.winopenCommandHintAction;
      case "hint.source":
        return this.openSourceHintAction;
    }

    throw new Error(`Unknown hint action: ${name}`);
  }
}
