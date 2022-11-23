import { injectable, inject } from "inversify";
import ConsoleUseCase from "../usecases/ConsoleUseCase";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class ConsoleController {
  constructor(
    @inject(ConsoleUseCase)
    private readonly consoleUseCase: ConsoleUseCase
  ) {}

  resize(
    ctx: RequestContext,
    { width, height }: { width: number; height: number }
  ) {
    const tabId = ctx.sender.tab?.id;
    if (!tabId) {
      return;
    }
    return this.consoleUseCase.resize(tabId, width, height);
  }
}
