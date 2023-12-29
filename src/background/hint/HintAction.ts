import type HintTarget from "./HintTarget";

interface HintAction {
  lookupTargetSelector(): string;

  activate(
    tabId: number,
    target: HintTarget,
    opts: { newTab: boolean; background: boolean },
  ): Promise<void>;
}

export default HintAction;
