import { inject, injectable } from "inversify";
import type FindPresenter from "../presenters/FindPresenter";
import type FindQuery from "../../shared/FindQuery";

@injectable()
export default class FindUseCase {
  constructor(
    @inject("FindPresenter")
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
