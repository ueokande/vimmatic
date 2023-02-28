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
    return this.startFindUseCase.startFind(ctx, keyword);
  }
}
