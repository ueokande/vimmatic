import { injectable, inject } from "inversify";
import StartFindUseCase from "../usecases/StartFindUseCase";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class FindController {
  constructor(
    @inject(StartFindUseCase)
    private startFindUseCase: StartFindUseCase
  ) {}

  startFind(
    ctx: RequestContext,
    { keyword }: { keyword?: string }
  ): Promise<void> {
    const tabId = ctx.sender.tab?.id;
    if (!tabId) {
      return Promise.resolve();
    }
    return this.startFindUseCase.startFind(tabId, keyword);
  }
}
