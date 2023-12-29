import { injectable, inject } from "inversify";
import HintClient from "../clients/HintClient";
import TabPresenter from "../presenters/TabPresenter";
import HintAction from "./HintAction";
import QuickHintAction from "./QuickHintAction";

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
  ) {}
  createHintAction(name: string): HintAction {
    switch (name) {
      case "hint.quick":
        return new QuickHintAction(this.hintClient, this.tabPresenter);
    }

    throw new Error(`Unknown hint action: ${name}`);
  }
}
