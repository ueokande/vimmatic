import { injectable, inject } from "inversify";
import MarkUseCase from "../usecases/MarkUseCase";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class MarkController {
  constructor(
    @inject(MarkUseCase)
    private readonly markUseCase: MarkUseCase
  ) {}

  setGlobal(
    _ctx: RequestContext,
    {
      key,
      x,
      y,
    }: {
      key: string;
      x: number;
      y: number;
    }
  ): Promise<void> {
    return this.markUseCase.setGlobal(key, x, y);
  }

  jumpGlobal(_ctx: RequestContext, { key }: { key: string }): Promise<void> {
    return this.markUseCase.jumpGlobal(key);
  }
}
