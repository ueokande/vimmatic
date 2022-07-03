import { injectable, inject } from "inversify";
import ConsoleUseCase from "../usecases/ConsoleUseCase";

@injectable()
export default class ConsoleController {
  constructor(
    @inject(ConsoleUseCase)
    private readonly consoleUseCase: ConsoleUseCase
  ) {}

  resize(senderTabId: number, width: number, height: number) {
    return this.consoleUseCase.resize(senderTabId, width, height);
  }
}
