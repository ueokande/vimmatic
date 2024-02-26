import { injectable, inject } from "inversify";
import ConsoleUseCase from "../usecases/ConsoleUseCase";
import type { RequestContext } from "../messaging/types";

@injectable()
export default class ConsoleController {
  constructor(
    @inject(ConsoleUseCase)
    private readonly consoleUseCase: ConsoleUseCase,
  ) {}

  resize(
    { sender }: RequestContext,
    { width, height }: { width: number; height: number },
  ) {
    if (typeof sender.tab?.id === "undefined") {
      return;
    }
    return this.consoleUseCase.resize(sender.tab.id, width, height);
  }
}
