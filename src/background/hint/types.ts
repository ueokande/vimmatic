export type HintTarget = {
  frameId: number;
  element: string;
  tag: string;
};

export interface HintAction {
  description(): string;

  lookupTargetSelector(): string;

  activate(
    tabId: number,
    target: HintTarget,
    opts: { newTab: boolean; background: boolean },
  ): Promise<void>;
}
