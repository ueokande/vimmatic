import { injectable } from "inversify";
import * as messages from "../../shared/messages";

export default interface AddonIndicatorClient {
  setEnabled(enabled: boolean): Promise<void>;
}

@injectable()
export class AddonIndicatorClientImpl implements AddonIndicatorClient {
  setEnabled(enabled: boolean): Promise<void> {
    return browser.runtime.sendMessage({
      type: messages.ADDON_ENABLED_RESPONSE,
      enabled,
    });
  }
}
