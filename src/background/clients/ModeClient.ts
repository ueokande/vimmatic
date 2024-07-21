import { provide } from "inversify-binding-decorators";
import { newSender } from "./ContentMessageSender";
import type { Mode } from "../../shared/mode";

export interface ModeClient {
  setMode(tabid: number, mode: Mode): Promise<void>;
}

export const ModeClient = Symbol("ModeClient");

@provide(ModeClient)
export class ModeClientImpl implements ModeClient {
  async setMode(tabId: number, mode: Mode): Promise<void> {
    const sender = newSender(tabId);
    sender.send("set.mode", { mode });
  }
}
