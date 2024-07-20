import { injectable, inject } from "inversify";
import type { ConsoleFramePresenter } from "../presenters/ConsoleFramePresenter";
import type { ReadyStatusPresenter } from "../presenters/ReadyStatusPresenter";

@injectable()
export class ConsoleFrameUseCase {
  constructor(
    @inject("ConsoleFramePresenter")
    private readonly consoleFramePresenter: ConsoleFramePresenter,
    @inject("ReadyStatusPresenter")
    private readonly readyStatusPresenter: ReadyStatusPresenter,
  ) {}

  unfocus() {
    window.focus();
    this.consoleFramePresenter.blur();
  }

  resize(width: number, height: number) {
    this.consoleFramePresenter.resize(width, height);
  }

  makeConsoleReady() {
    this.readyStatusPresenter.setConsoleReady();
  }
}
