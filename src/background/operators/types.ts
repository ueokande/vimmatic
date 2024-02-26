import type { z } from "zod";

export type Props = Record<string, string | number | boolean>;
export type PropsSchema = ReturnType<typeof z.object>;
export type OperatorContext = {
  sender: {
    tabId: number;
    frameId: number;
    tab: chrome.tabs.Tab;
  };
};

export interface Operator {
  name(): string;

  schema(): PropsSchema | void;

  run(ctx: OperatorContext, props: Props): Promise<void>;
}
