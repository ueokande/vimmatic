import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { FinderRepository } from "../repositories/FinderRepository";
import type { FindRange } from "../repositories/FinderRepository";
import type { FindQuery } from "../../shared/findQuery";

export interface FindPresenter {
  findNext(query: FindQuery): boolean;
  findPrev(query: FindQuery): boolean;
  clearSelection(): void;
}

export const FindPresenter = Symbol("FindPresenter");

@provide(FindPresenter)
export class FindPresenterImpl implements FindPresenter {
  constructor(
    @inject(FinderRepository)
    private readonly finderRepository: FinderRepository,
  ) {}

  findNext({ keyword, mode, ignoreCase }: FindQuery): boolean {
    this.finderRepository.initFinder({ keyword, mode, ignoreCase });

    const matched = this.finderRepository.findNext();
    if (!matched) return false;

    this.select(matched);
    return true;
  }

  findPrev({ keyword, mode, ignoreCase }: FindQuery): boolean {
    this.finderRepository.initFinder({ keyword, mode, ignoreCase });

    const matched = this.finderRepository.findPrev();
    if (!matched) return false;

    this.select(matched);
    return true;
  }

  select(matched: FindRange): void {
    this.finderRepository.select(matched);
    this.finderRepository.scrollTo(matched);
  }

  clearSelection(): void {
    this.finderRepository.clearSelection();
  }
}
