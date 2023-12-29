import type HintActionFactory from "../../../src/background/hint/HintActionFactory";
import type HintTarget from "../../../src/background/hint/HintTarget";
import type HintAction from "../../../src/background/hint/HintAction";

class MockHintAction implements HintAction {
  constructor(public readonly name: string) {}

  lookupTargetSelector(): string {
    return "[mock]";
  }

  activate(
    _tabId: number,
    _target: HintTarget,
    _opts: { newTab: boolean; background: boolean },
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default class MockHintActionFactory implements HintActionFactory {
  createHintAction(name: string): HintAction {
    return new MockHintAction(name);
  }
}
