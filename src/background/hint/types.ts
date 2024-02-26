export type HintTarget = {
  frameId: number;
  element: string;
  tag: string;
};

export interface HintAction {
  lookupTargetSelector(): string;

  activate(
    tabId: number,
    target: HintTarget,
    opts: { newTab: boolean; background: boolean },
  ): Promise<void>;
}
