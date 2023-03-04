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
    { sender }: RequestContext,
    { keyword }: { keyword?: string }
  ): Promise<void> {
    if (typeof sender.tab?.id === "undefined") {
      return Promise.resolve();
    }
    return this.startFindUseCase.startFind(sender.tab.id, keyword);
  }
}
