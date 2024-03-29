import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";
import { Mode } from "../../shared/mode";

export interface ModeClient {
  setMode(tabid: number, mode: Mode): Promise<void>;
}

@injectable()
export class ModeClientImpl implements ModeClient {
  async setMode(tabId: number, mode: Mode): Promise<void> {
    const sender = newSender(tabId);
    sender.send("set.mode", { mode });
  }
}
