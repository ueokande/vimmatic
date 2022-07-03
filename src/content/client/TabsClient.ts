import { injectable } from "inversify";
import * as messages from "../../shared/messages";

export default interface TabsClient {
  openUrl(url: string, newTab: boolean, background?: boolean): Promise<void>;
}

@injectable()
export class TabsClientImpl implements TabsClient {
  async openUrl(
    url: string,
    newTab: boolean,
    background?: boolean
  ): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.OPEN_URL,
      url,
      newTab,
      background,
    });
  }
}
