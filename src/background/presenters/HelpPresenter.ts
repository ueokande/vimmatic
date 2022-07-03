import { injectable } from "inversify";

const url = "https://ueokande.github.io/vimmatic/";

@injectable()
export default class HelpPresenter {
  async open(): Promise<void> {
    await browser.tabs.create({ url, active: true });
  }
}
