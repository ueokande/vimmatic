import { injectable, inject } from "inversify";
import { ConsoleFrameUseCase } from "../usecases/ConsoleFrameUseCase";

@injectable()
export class ConsoleFrameController {
  constructor(
    @inject(ConsoleFrameUseCase)
    private readonly consoleFrameUseCase: ConsoleFrameUseCase,
  ) {}

  unfocus() {
    this.consoleFrameUseCase.unfocus();
  }

  ready() {
    this.consoleFrameUseCase.makeConsoleReady();
  }

  resize({ width, height }: { width: number; height: number }) {
    this.consoleFrameUseCase.resize(width, height);
  }
}
