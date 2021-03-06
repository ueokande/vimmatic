import { injectable, inject } from "inversify";
import { Message } from "../../shared/messages";
import NavigateUseCase from "../usecases/NavigateUseCase";

@injectable()
export default class NavigateController {
  constructor(
    @inject(NavigateUseCase)
    private readonly navigateUseCase: NavigateUseCase
  ) {}

  openHistoryNext(_m: Message): Promise<void> {
    this.navigateUseCase.openHistoryNext();
    return Promise.resolve();
  }

  openHistoryPrev(_m: Message): Promise<void> {
    this.navigateUseCase.openHistoryPrev();
    return Promise.resolve();
  }

  openLinkNext(_m: Message): Promise<void> {
    this.navigateUseCase.openLinkNext();
    return Promise.resolve();
  }

  openLinkPrev(_m: Message): Promise<void> {
    this.navigateUseCase.openLinkPrev();
    return Promise.resolve();
  }
}
