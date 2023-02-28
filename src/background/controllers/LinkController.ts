import { injectable, inject } from "inversify";
import LinkUseCase from "../usecases/LinkUseCase";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class LinkController {
  constructor(
    @inject(LinkUseCase)
    private readonly linkUseCase: LinkUseCase
  ) {}

  openURL(
    ctx: RequestContext,
    {
      url,
      newTab,
      background,
    }: {
      url: string;
      newTab: boolean;
      background: boolean;
    }
  ): Promise<void> {
    const openerId = ctx.sender.tabId;
    if (newTab) {
      return this.linkUseCase.openNewTab(url, openerId, background);
    }
    return this.linkUseCase.openToTab(url, openerId);
  }
}
