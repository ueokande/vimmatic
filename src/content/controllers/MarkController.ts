import { injectable, inject } from "inversify";
import * as messages from "../../shared/messages";
import MarkUseCase from "../usecases/MarkUseCase";

@injectable()
export default class MarkController {
  constructor(
    @inject(MarkUseCase)
    private readonly markUseCase: MarkUseCase
  ) {}

  scrollTo(message: messages.TabScrollToMessage) {
    this.markUseCase.scroll(message.x, message.y);
  }
}
