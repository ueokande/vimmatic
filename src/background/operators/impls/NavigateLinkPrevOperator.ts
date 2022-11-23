import { inject, injectable } from "inversify";
import Operator from "../Operator";
import NavigateClient from "../../clients/NavigateClient";

@injectable()
export default class NavigateLinkPrevOperator implements Operator {
  constructor(
    @inject("NavigateClient")
    private readonly navigateClient: NavigateClient
  ) {}

  name() {
    return "navigate.link.prev";
  }

  schema() {}

  async run(): Promise<void> {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    await this.navigateClient.linkPrev(tab.id!);
  }
}
