import { injectable, inject } from "inversify";
import ConsoleFrameUseCase from "../usecases/ConsoleFrameUseCase";
import * as messages from "../../shared/messages";

@injectable()
export default class ConsoleFrameController {
  constructor(
    @inject(ConsoleFrameUseCase)
    private readonly consoleFrameUseCase: ConsoleFrameUseCase
  ) {}

  unfocus(_message: messages.Message) {
    this.consoleFrameUseCase.unfocus();
  }

  resize(message: messages.ConsoleResizeMessage) {
    this.consoleFrameUseCase.resize(message.width, message.height);
  }
}
