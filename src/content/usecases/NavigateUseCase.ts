import { injectable, inject } from "inversify";
import { NavigationPresenter } from "../presenters/NavigationPresenter";

@injectable()
export class NavigateUseCase {
  constructor(
    @inject(NavigationPresenter)
    private readonly navigationPresenter: NavigationPresenter,
  ) {}

  openHistoryPrev(): void {
    this.navigationPresenter.openHistoryPrev();
  }

  openHistoryNext(): void {
    this.navigationPresenter.openHistoryNext();
  }

  openLinkPrev(): void {
    this.navigationPresenter.openLinkPrev();
  }

  openLinkNext(): void {
    this.navigationPresenter.openLinkNext();
  }
}
