import { inject, injectable } from "inversify";
import { FindPresenter } from "../presenters/FindPresenter";
import type { FindQuery } from "../../shared/findQuery";

@injectable()
export class FindUseCase {
  constructor(
    @inject(FindPresenter)
    private readonly findPresenter: FindPresenter,
  ) {}

  findNext(query: FindQuery) {
    return this.findPresenter.findNext(query);
  }

  findPrev(query: FindQuery) {
    return this.findPresenter.findPrev(query);
  }

  clearSelection() {
    this.findPresenter.clearSelection();
  }
}
