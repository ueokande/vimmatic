import { injectable } from "inversify";
import { newSender } from "./ContentMessageSender";

export default interface KeyCaptureClient {
  enableKeyCapture(tabId: number): Promise<void>;

  disableKeyCapture(tabId: number): Promise<void>;
}

@injectable()
export class KeyCaptureClientImpl implements KeyCaptureClient {
  async enableKeyCapture(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("enable.key.capture");
  }

  async disableKeyCapture(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("disable.key.capture");
  }
}
