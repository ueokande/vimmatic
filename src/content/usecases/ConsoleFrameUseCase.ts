import { injectable, inject } from "inversify";
import ConsoleFramePresenter from "../presenters/ConsoleFramePresenter";
import ReadyStatusPresenter from "../presenters/ReadyStatusPresenter";

@injectable()
export default class ConsoleFrameUseCase {
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
