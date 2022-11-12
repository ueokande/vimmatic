import { injectable, inject } from "inversify";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface TabsClient {
  openUrl(url: string, newTab: boolean, background?: boolean): Promise<void>;
}

@injectable()
export class TabsClientImpl implements TabsClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async openUrl(
    url: string,
    newTab: boolean,
    background = false
  ): Promise<void> {
    await this.sender.send("open.url", { url, newTab, background });
  }
}
