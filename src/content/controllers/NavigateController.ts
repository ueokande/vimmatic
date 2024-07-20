import { injectable, inject } from "inversify";
import { NavigateUseCase } from "../usecases/NavigateUseCase";

@injectable()
export class NavigateController {
  constructor(
    @inject(NavigateUseCase)
    private readonly navigateUseCase: NavigateUseCase,
  ) {}

  openHistoryNext(): Promise<void> {
    this.navigateUseCase.openHistoryNext();
    return Promise.resolve();
  }

  openHistoryPrev(): Promise<void> {
    this.navigateUseCase.openHistoryPrev();
    return Promise.resolve();
  }

  openLinkNext(): Promise<void> {
    this.navigateUseCase.openLinkNext();
    return Promise.resolve();
  }

  openLinkPrev(): Promise<void> {
    this.navigateUseCase.openLinkPrev();
    return Promise.resolve();
  }
}
