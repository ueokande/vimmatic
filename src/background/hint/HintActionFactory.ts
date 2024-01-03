import { injectable, inject } from "inversify";
import type HintClient from "../clients/HintClient";
import type TabPresenter from "../presenters/TabPresenter";
import type ClipboardRepository from "../repositories/ClipboardRepository";
import type ConsoleClient from "../clients/ConsoleClient";
import type HintAction from "./HintAction";
import QuickHintAction from "./QuickHintAction";
import OpenImageHintAction from "./OpenImageHintAction";
import YankURLHintAction from "./YankURLHintAction";
import YankLinkTextHintAction from "./YankLinkTextHintAction";

export default interface HintActionFactory {
  createHintAction(name: string): HintAction;
}

@injectable()
export class HintActionFactoryImpl implements HintActionFactory {
  constructor(
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    @inject("ClipboardRepository")
    private readonly clipboardRepository: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}
  createHintAction(name: string): HintAction {
    switch (name) {
      case "hint.quick":
        return new QuickHintAction(this.hintClient, this.tabPresenter);
      case "hint.openimage":
        return new OpenImageHintAction(this.hintClient, this.tabPresenter);
      case "hint.yankurl":
        return new YankURLHintAction(
          this.hintClient,
          this.clipboardRepository,
          this.consoleClient,
        );
      case "hint.yanklinktext":
        return new YankLinkTextHintAction(
          this.hintClient,
          this.clipboardRepository,
          this.consoleClient,
        );
    }

    throw new Error(`Unknown hint action: ${name}`);
  }
}
