import { injectable, inject } from "inversify";
import LinkUseCase from "../usecases/LinkUseCase";

@injectable()
export default class LinkController {
  constructor(
    @inject(LinkUseCase)
    private readonly linkUseCase: LinkUseCase
  ) {}

  openToTab(url: string, tabId: number): Promise<void> {
    return this.linkUseCase.openToTab(url, tabId);
  }

  openNewTab(
    url: string,
    openerId: number,
    background: boolean
  ): Promise<void> {
    return this.linkUseCase.openNewTab(url, openerId, background);
  }
}
